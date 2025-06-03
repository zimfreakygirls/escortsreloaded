
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Edit, Play, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VideoProfile {
  id: string;
  name: string;
  video_url: string;
  images: string[];
  created_at: string;
}

export function VideoManager() {
  const [videos, setVideos] = useState<VideoProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<VideoProfile | null>(null);
  const [editForm, setEditForm] = useState({ name: "", video_url: "" });
  const { toast } = useToast();

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('country', 'Video')
        .not('video_url', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch videos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', videoId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video deleted successfully"
      });

      fetchVideos();
    } catch (error: any) {
      console.error('Error deleting video:', error);
      toast({
        title: "Error",
        description: `Failed to delete video: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (video: VideoProfile) => {
    setEditingVideo(video);
    setEditForm({
      name: video.name,
      video_url: video.video_url
    });
  };

  const handleUpdate = async () => {
    if (!editingVideo) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editForm.name,
          video_url: editForm.video_url
        })
        .eq('id', editingVideo.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video updated successfully"
      });

      setEditingVideo(null);
      fetchVideos();
    } catch (error: any) {
      console.error('Error updating video:', error);
      toast({
        title: "Error",
        description: `Failed to update video: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const getTelegramEmbedUrl = (url: string) => {
    if (!url) return '';
    
    if (url.includes('t.me/c/')) {
      const parts = url.split('/');
      const channelId = parts[parts.indexOf('c') + 1];
      const messageId = parts[parts.indexOf('c') + 2];
      return `https://t.me/s/${channelId}/${messageId}`;
    } else if (url.includes('t.me/')) {
      return url.replace('t.me/', 't.me/s/');
    }
    
    return url;
  };

  return (
    <Card className="border-0 shadow-xl bg-[#292741] backdrop-blur-sm text-white">
      <CardHeader className="border-b border-gray-800 pb-6">
        <CardTitle className="text-xl font-medium flex items-center">
          <Video className="w-5 h-5 text-[#9b87f5] mr-2" />
          Manage Videos
        </CardTitle>
        <CardDescription className="text-gray-400">
          View, edit, and delete uploaded videos
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-[#9b87f5] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading videos...</p>
          </div>
        ) : videos.length > 0 ? (
          <div className="space-y-4">
            {videos.map((video) => (
              <div key={video.id} className="bg-[#1e1c2e] rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={video.images[0] || '/placeholder.svg'} 
                    alt={video.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-medium text-white">{video.name}</h3>
                    <p className="text-sm text-gray-400">
                      Created: {new Date(video.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {video.video_url}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-[#9b87f5] hover:bg-[#9b87f5]/80 border-none">
                        <Play className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl bg-[#1e1c2e] border-gray-800">
                      <DialogTitle className="text-xl font-semibold mb-4">{video.name}</DialogTitle>
                      <iframe 
                        src={getTelegramEmbedUrl(video.video_url)}
                        frameBorder="0" 
                        width="100%" 
                        height="480"
                        allowFullScreen
                        title="Telegram Video"
                        className="rounded-md"
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(video)}
                    className="bg-blue-600 hover:bg-blue-700 border-none"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(video.id)}
                    className="bg-red-600 hover:bg-red-700 border-none"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No videos uploaded yet.</p>
          </div>
        )}

        {/* Edit Dialog */}
        {editingVideo && (
          <Dialog open={!!editingVideo} onOpenChange={() => setEditingVideo(null)}>
            <DialogContent className="bg-[#1e1c2e] border-gray-800">
              <DialogTitle className="text-xl font-semibold mb-4">Edit Video</DialogTitle>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Title</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-[#292741] border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-url">Telegram URL</Label>
                  <Input
                    id="edit-url"
                    value={editForm.video_url}
                    onChange={(e) => setEditForm(prev => ({ ...prev, video_url: e.target.value }))}
                    className="bg-[#292741] border-gray-700"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdate} className="bg-[#9b87f5] hover:bg-[#9b87f5]/80">
                    Update Video
                  </Button>
                  <Button variant="outline" onClick={() => setEditingVideo(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}


import { Header } from "@/components/Header";
import { useEffect, useRef } from "react";

export default function Chat() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create the iframe for the chat widget
    if (containerRef.current) {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://e.widgetbot.io/channels/1097581099510677577/1097581099510677580';
      iframe.width = '100%';
      iframe.height = '600';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      iframe.setAttribute('allowTransparency', 'true');
      iframe.allow = 'autoplay; camera; microphone; clipboard-read; clipboard-write; web-share';
      
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(iframe);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Chat Room</h1>
          
          <div ref={containerRef} className="rounded-lg overflow-hidden mb-6 bg-gray-800 min-h-[600px] flex items-center justify-center">
            <p className="text-gray-400">Loading chat...</p>
          </div>
        </div>
      </main>
    </div>
  );
}

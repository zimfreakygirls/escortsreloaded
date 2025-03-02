
import { Header } from "@/components/Header";
import { useEffect } from "react";

export default function Chat() {
  useEffect(() => {
    // Load the WidgetBot script dynamically
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@widgetbot/html-embed";
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // Clean up the script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Chat Room</h1>
          
          <div className="widgetbot-container rounded-lg overflow-hidden mb-6">
            <widgetbot
              server="1097581099510677577"
              channel="1097581099510677580"
              width="100%"
              height="600"
            ></widgetbot>
          </div>
        </div>
      </main>
    </div>
  );
}

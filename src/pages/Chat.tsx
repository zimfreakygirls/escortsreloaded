
import { Header } from "@/components/Header";
import { useEffect, useRef } from "react";

export default function Chat() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load the WidgetBot script dynamically
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@widgetbot/html-embed";
    script.async = true;
    document.body.appendChild(script);
    
    // Create the WidgetBot element after the script is loaded
    script.onload = () => {
      if (containerRef.current && window.WidgetBot) {
        const widgetBotElement = document.createElement('div');
        widgetBotElement.className = 'widgetbot';
        widgetBotElement.setAttribute('server', '1097581099510677577');
        widgetBotElement.setAttribute('channel', '1097581099510677580');
        widgetBotElement.style.width = '100%';
        widgetBotElement.style.height = '600px';
        
        // Clear container and append the element
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(widgetBotElement);
      }
    };
    
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
          
          <div ref={containerRef} className="rounded-lg overflow-hidden mb-6 bg-gray-800 min-h-[600px] flex items-center justify-center">
            <p className="text-gray-400">Loading chat...</p>
          </div>
        </div>
      </main>
    </div>
  );
}

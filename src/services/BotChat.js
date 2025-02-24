import React, { useEffect } from "react";
// import "https://cdn.botpress.cloud/webchat/v1/inject.js";

const BotChat = () => {
  useEffect(() => {
    const loadBotpressWebChat = () => {
      window.botpressWebChat.init({
        composerPlaceholder: "Chat with bot",
        // botConversationDescription:"This chatbot was built surprisingly fast with Botpress",
        botId: "94fa7b9e-a13d-463e-be46-c824955b2be7",
        hostUrl: "https://cdn.botpress.cloud/webchat/v1",
        messagingUrl: "https://messaging.botpress.cloud",
        clientId: "94fa7b9e-a13d-463e-be46-c824955b2be7",
        webhookId: "8dbb3240-ded7-4bb6-b720-38d5c9d704a5",
        lazySocket: true,
        themeName: "prism",
        frontendVersion: "v1",
        // showPoweredBy: true,
        theme: "prism",
        themeColor: "#5B52E7",
        showCloseButton: true,
        stylesheet:
          "https://webchat-styler-css.botpress.app/prod/1875abae-2414-4376-9d48-d98ceb17ad27/v31351/style.css",
      });
      window.botpressWebChat.onEvent(() => {
        window.botpressWebChat.sendEvent({ type: "show" });
      }, ["LIFECYCLE.LOADED"]);
    };

    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v1/inject.js";
    document.head.appendChild(script);
    script.onload = () => {
      loadBotpressWebChat();
    };
    return () => {
      document.head.removeChild(script);
      const existingIframe = document.getElementById("bp-web-widget");
      if (existingIframe) {
        existingIframe.parentNode.removeChild(existingIframe);
      }
      delete window.botpressWebChat;
    };
  }, []);
  return <div id="bp-web-widget-container"></div>;
};
export default BotChat;

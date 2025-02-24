import React, { useEffect } from "react";

const CourceBot = () => {
  useEffect(() => {
    let scriptSecond;
    let script;
    const iframe = document.querySelectorAll(`iframe[title="${'Botpress'}"]`);
      if(!iframe || iframe.length === 0){
        script = document.createElement("script");
        script.src = "https://cdn.botpress.cloud/webchat/v2.1/inject.js";
        document.head.appendChild(script);
        
        script.onload = () => {
        scriptSecond = document.createElement("script");
        scriptSecond.src = "https://mediafiles.botpress.cloud/733f436a-0ad4-4251-bf22-f131c0bec407/webchat/v2.1/config.js";
        document.head.appendChild(scriptSecond);
      }
    }
    if(iframe && iframe.length > 0){
      iframe.forEach( i => i.style.display = 'block')
    }
    return () => {
      const iframe = document.querySelectorAll(`iframe[title="${'Botpress'}"]`);
      if(iframe && iframe.length > 0){
        iframe.forEach( i => i.style.display = 'none')
      }
    };
  }, []);
  return <div id="bp-web-widget-container"></div>;
};
export default CourceBot;

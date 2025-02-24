import { Webchat, WebchatProvider, Fab, getClient, Container, Header, MessageList, Composer, ComposerInput, ComposerButton } from "@botpress/webchat";
import { buildTheme } from "@botpress/webchat-generator";
import React, { useEffect, useState,useMemo } from "react";

const { theme, style } = buildTheme({
  themeName: "midnight",
  themeColor: "#5B52E7",
});

const clientId = "6fbb4e05-5183-4113-9c80-4349957edd2f";

const PromptButton = ({prompts, client}) =>{
  return <div>
    {prompts?.length > 0 && prompts.map((prompt, index)=>{
      return <div key={index} class="inline-flex items-center px-3 py-1 m-1 bg-[#5B52E7] text-white text-sm font-medium rounded-full cursor-pointer" onClick={async()=>{
        await client.sendMessage(prompt?.title)
        console.log(prompt?.title)
        await client.listMessages()
      }}>
        <span id="chip-content">{prompt?.title}</span>
    </div> 
    })}
  </div>
}
  
const config = {
  composerPlaceholder: "What would you like to know?",
  botName: "Pollinator",
  botAvatar: "https://1550205407.rsc.cdn77.org/logo/chatbotlogo.png",
  botDescription:
    "Hi! 👋",
};


function Bot({id, title,type, prompts}) {
  const client = useMemo(() => getClient({ clientId }), [clientId]);

  return (
    <div className="sticky top-10">
      <style>{style}</style>
      {title?.length > 0 ?
         <WebchatProvider
         key={JSON.stringify(config)}
         theme={theme}
         configuration={config}
         client={client}
         userData={{...(id ? { id: String(id) } : {}), "type": type, "title":JSON.stringify(title || [])}}
 
       >
         <Container style={{height: 800}}>
             <Header  />
             <MessageList />
             <Composer >
             <ComposerInput />
             <ComposerButton />
             </Composer>
             <PromptButton prompts={prompts} client={client}/>
         </Container>
       </WebchatProvider> : <></>
      }
    </div>
  );
}

export default React.memo(Bot);
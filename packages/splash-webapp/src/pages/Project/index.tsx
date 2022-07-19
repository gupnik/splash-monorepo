import { SplashProjectFactory } from "@splash/sdk";
import { useContractFunction } from "@usedapp/core";
import { Button } from "react-bootstrap";
import config from "../../config";
import Designer from "../../designer/Designer";
import { Rect, Text, Image } from "../../designer/objects";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Moralis from "moralis";
import { svgToPng } from "./utils";

interface ProjectPageProps {
  
}

const ProjectPage: React.FC<ProjectPageProps> = props => {
  const history = useHistory();

  const splashProjectContract = new SplashProjectFactory().attach(
    config.addresses.splashProject,
  );

  const { send: updateURI, state: updateURIState } = useContractFunction(
    splashProjectContract,
    'updateURI',
  );

  const [objects, setObjects] = useState<any>([
    // {type: "text", x: 10, y: 20, text: "Hello!", fill: "red"},
    {type: "rect", x: 50, y: 50, width: 50, height: 50, fill: "red"}
  ])

  const onExit = async () => {
    const svgElement = document.getElementById('project-svg')!;

    svgToPng(svgElement.outerHTML, async (base64PNG: string) => {
      const imageFile = new Moralis.File("image.png", { base64: base64PNG });
      const imageResult = await imageFile.saveIPFS();
      const imageIPFS = (imageResult as any).ipfs();
      console.log(imageIPFS);
      const imageHash = (imageResult as any).hash();

      const metadata = {
        name: "Project 1",
        description: "Here we are!",
        "image": `ipfs://${imageHash}`,
        "attributes": []
      }

       const metadataFile = new Moralis.File("data.json", {
          base64: btoa(JSON.stringify(metadata)),
        }, "application/json");
        const metadataResult = await metadataFile.saveIPFS();
        const metadataIPFS = (metadataResult as any).ipfs();
        console.log(metadataIPFS);
        const metadataHash = (metadataResult as any).hash();

        await updateURI(1, `ipfs://${metadataHash}`); //`ipfs://${hash}`
        history.goBack();
    });
  };
 
  return (
    <>
    <Designer 
      width={250} height={350}
      objectTypes={{
        'image': Image,
        'text': Text,
        'rect': Rect
      }}
      onUpdate={(objects: any) => {setObjects(objects)}}
      objects={objects}/>
    <Button onClick={() => onExit()}>{updateURIState.status === "Mining" ? "Mining..." : "Exit"}</Button>
    </>
  )
}

export default ProjectPage;
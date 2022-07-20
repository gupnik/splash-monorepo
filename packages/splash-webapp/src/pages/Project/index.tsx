import { SplashProjectFactory } from "@splash/sdk";
import { useContractFunction } from "@usedapp/core";
import config from "../../config";
import Designer from "../../designer/Designer";
import { Rect, Text, Image } from "../../designer/objects";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Moralis from "moralis";
import { svgToPng } from "./utils";
import { Box, Button, Card, CardActionArea, CardActions, CardContent, Grid, Stack, Typography } from "@mui/material";
import { useAppSelector } from "../../hooks";
import ProjectCard from "../../components/ProjectCard";

interface ProjectPageProps {
  
}

const ProjectPage: React.FC<ProjectPageProps> = props => {
  const history = useHistory();
  const projects = useAppSelector(state => state.projects.projects);

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
    <Stack direction="row" >
      <Stack>
        <Designer 
        width={250} height={350}
        objectTypes={{
          'image': Image,
          'text': Text,
          'rect': Rect
        }}
        onUpdate={(objects: any) => {setObjects(objects)}}
        objects={objects}/>
        <Box height={40}/>
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
                {/* <CardMedia
                    component="img"
                    height="140"
                    // image="/static/images/cards/contemplative-reptile.jpg"
                    alt="green iguana"
                /> */}
                <CardContent style={{ backgroundColor: "lightgray" }}>
                    <Typography variant="body2" color="text.secondary">
                        Click EXIT to exit the project!
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary" onClick={() => {
                            if (updateURIState.status !== "Mining") { 
                              onExit()
                            }                          
                    }}>
                    {updateURIState.status === "Mining" ? "Mining..." : "Exit"} 
                    </Button>
                </CardActions>
            </CardActionArea>
        </Card>
      </Stack>
        <Box width={40}/>
        <Grid container spacing={2}>
            {projects.map((project, indx) => (
                <ProjectCard project={project} key={indx} isHome={false} />
            ))}
        </Grid>
    </Stack>
    {/* <Button onClick={() => onExit()}>{updateURIState.status === "Mining" ? "Mining..." : "Exit"}</Button> */}
    </>
  )
}

export default ProjectPage;
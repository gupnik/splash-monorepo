import { SplashProjectFactory } from "@splash/sdk";
import { useContractFunction } from "@usedapp/core";
import config from "../../config";
import Designer from "../../designer/Designer";
import { Rect, Text, Image } from "../../designer/objects";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { svgToPng } from "./utils";
import { Box, Button, Card, CardActions, CardContent, Grid, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks";
import ProjectCard from "../../components/ProjectCard";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../utils/pinata";
import { setProjectData } from "../../state/slices/projects";

interface ProjectPageProps {
  
}

const ProjectPage: React.FC<ProjectPageProps> = props => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const projects = useAppSelector(state => state.projects.projects);
  const projectURI = useAppSelector(state => state.projects.projects[id] && state.projects.projects[id].uri);
  const projectData: any = useAppSelector(state => state.projects.projects[id] && state.projects.projects[id].data);

  const splashProjectContract = new SplashProjectFactory().attach(
    config.addresses.splashProject,
  );

  const { send: updateURI, state: updateURIState } = useContractFunction(
    splashProjectContract,
    'updateURI',
  );

  const [objects, setObjects] = useState<any>([
    // {type: "text", x: 10, y: 20, text: "Hello!", fill: "red"},
    // {type: "rect", x: 50, y: 50, width: 50, height: 50, fill: "red"}
  ])

  const onExit = async () => {
    const svgElement = document.getElementById('project-svg')!;

    svgToPng(svgElement.outerHTML, async (base64File: File) => {
      let { pinataURL, ipfsHash } = await uploadFileToIPFS(base64File, `Project ${id}.png`);

      const metadata = {
        name: `Project ${id}`,
        description: JSON.stringify(objects),
        "image": `ipfs://${ipfsHash}`, //pinataURL,
        "attributes": []
      }

      let { pinataURL: jsonURL, ipfsHash: jsonHash } = await uploadJSONToIPFS(metadata); 

      await updateURI(1, `ipfs://${jsonHash}`); 
      history.goBack();
    });

    // svgToPng(svgElement.outerHTML, async (base64PNG: string) => {
    //   const imageFile = new Moralis.File("image.png", { base64: base64PNG });
    //   const imageResult = await imageFile.saveIPFS();
    //   const imageIPFS = (imageResult as any).ipfs();
    //   console.log(imageIPFS);
    //   const imageHash = (imageResult as any).hash();

    //   const metadata = {
    //     name: "Project 1",
    //     description: "Here we are!",
    //     "image": `ipfs://${imageHash}`,
    //     "attributes": []
    //   }

    //    const metadataFile = new Moralis.File("data.json", {
    //       base64: btoa(JSON.stringify(metadata)),
    //     }, "application/json");
    //     const metadataResult = await metadataFile.saveIPFS();
    //     const metadataIPFS = (metadataResult as any).ipfs();
    //     console.log(metadataIPFS);
    //     const metadataHash = (metadataResult as any).hash();

    //     await updateURI(1, `ipfs://${metadataHash}`); //`ipfs://${hash}`
    //     history.goBack();
    // });
  };

  useEffect(() => {
    projectData && projectData["description"] && setObjects(JSON.parse(projectData["description"]));
  }, [projectData])

  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(projectURI);
    const loadProjectData = async () => {
      try {
        const response = await fetch(projectURI.replace("ipfs://", "https://ipfs.io/ipfs/"), {
          // mode: 'no-cors'
        });
        const data = await response.json();
        dispatch(setProjectData({ id, data }));
      } catch (error) {
        
      }
    }

    loadProjectData();
  }, [projectURI, dispatch, id])
 
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
        </Card>
      </Stack>
        <Box width={40}/>
        <Grid container spacing={2}>
            {Object.entries(projects).map(([projectId, project]) => (
                <ProjectCard project={project} key={projectId} isHome={false} />
            ))}
        </Grid>
    </Stack>
    {/* <Button onClick={() => onExit()}>{updateURIState.status === "Mining" ? "Mining..." : "Exit"}</Button> */}
    </>
  )
}

export default ProjectPage;
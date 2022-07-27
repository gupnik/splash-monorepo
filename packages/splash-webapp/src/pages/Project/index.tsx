import { SplashProjectFactory } from "@splash/sdk";
import { useContractFunction } from "@usedapp/core";
import config from "../../config";
import Designer from "../../designer/Designer";
import { Rect, Text, Image } from "../../designer/objects";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { svgToPng } from "./utils";
import { Box, Button, Card, CardActions, CardContent, Grid, Stack, Typography } from "@mui/material";
import { useAppSelector } from "../../hooks";
import ProjectCard from "../../components/ProjectCard";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../utils/pinata";

interface ProjectPageProps {
  
}

const ProjectPage: React.FC<ProjectPageProps> = props => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const projects = useAppSelector(state => state.projects.projects);
  const projectDescription = useAppSelector(state => state.projects.projects[id] && state.projects.projects[id].description);
  const constituents = useAppSelector(state => state.projects.projects[id] && state.projects.projects[id].constituents);
  
  const splashProjectContract = new SplashProjectFactory().attach(
    config.addresses.splashProject,
  );

  const { send: updateURI, state: updateURIState } = useContractFunction(
    splashProjectContract,
    'updateURI',
  );

  const { send: add, state: addState } = useContractFunction(
    splashProjectContract,
    'add',
  );

  const [objects, setObjects] = useState<any>([
    // {type: "text", x: 10, y: 20, text: "Hello!", fill: "red"},
    // {type: "rect", x: 50, y: 50, width: 50, height: 50, fill: "red"}
  ])

  const onExit = async () => {
    const svgElement = document.getElementById('project-svg')!;

    svgToPng(svgElement.outerHTML, async (base64File: File) => {
      let { ipfsHash } = await uploadFileToIPFS(base64File, `Project ${id}.png`);

      const metadata = {
        name: `Project ${id}`,
        description: JSON.stringify(objects),
        "image": `ipfs://${ipfsHash}`, //pinataURL,
        "attributes": []
      }

      let { ipfsHash: jsonHash } = await uploadJSONToIPFS(metadata); 

      await updateURI(id, `ipfs://${jsonHash}`); 
      history.goBack();
    });
  };

  useEffect(() => {
    let objects: any[] = []
    if (projectDescription && projectDescription.startsWith("[")) {
      objects = JSON.parse(projectDescription);
    }
    constituents && constituents.forEach(x => {
      if (x.description && x.description.startsWith("[")) {
        objects = ([...objects, ...(JSON.parse(x.description))])
      }
    })
    setObjects(objects)
  }, [projectDescription, constituents])
 
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
                <ProjectCard project={project} key={projectId} 
                title={addState.status === "Mining" ? "Mining..." : "Add"} 
                onClose={async (description, price) => {
                  if (description && description.startsWith("[")) { 
                    try {             
                      await add(projectId, id, {
                        value: price
                      });
                      setObjects([...objects, ...(JSON.parse(description))])    
                    } catch (error) {
                      
                    }
                  }
                }} />
            ))}
        </Grid>
    </Stack>
    {/* <Button onClick={() => onExit()}>{updateURIState.status === "Mining" ? "Mining..." : "Exit"}</Button> */}
    </>
  )
}

export default ProjectPage;
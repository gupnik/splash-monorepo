import { SplashProjectFactory } from "@splash/sdk";
import { useContractFunction } from "@usedapp/core";
import config from "../../config";
import Designer from "../../designer/Designer";
import { Rect, Text, Image } from "../../designer/objects";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { svgToPng } from "./utils";
import { Box, Button, Card, CardActions, CardContent, Grid, List, ListItem, ListItemAvatar, ListItemText, Stack, TextField, Typography, Avatar, Divider } from "@mui/material";
import { useAppSelector } from "../../hooks";
import ProjectCard from "../../components/ProjectCard";
// import { uploadFileToIPFS, uploadJSONToIPFS } from "../../utils/pinata";
import { NFTStorage, File } from 'nft.storage/dist/bundle.esm.min.js';
// import mime from 'mime';

interface ProjectPageProps {
  
}

const ProjectPage: React.FC<ProjectPageProps> = props => {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState<string>(`Project ${id}`);
  const [tags, setTags] = useState<string>("");
  const history = useHistory();

  const projects = useAppSelector(state => state.projects.projects);
  const projectName = useAppSelector(state => state.projects.projects[id] && state.projects.projects[id].name);
  const projectDescription = useAppSelector(state => state.projects.projects[id] && state.projects.projects[id].description);
  const projectTags = useAppSelector(state => state.projects.projects[id] && state.projects.projects[id].tags);
  const constituents = useAppSelector(state => state.projects.projects[id] && state.projects.projects[id].constituents);

  const splashProjectContract = new SplashProjectFactory().attach(
    config.addresses.splashProject,
  );

  const { send: createProject, state: createProjectState } = useContractFunction(
    splashProjectContract,
    'create',
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

    svgToPng(`Project ${id}.png`, svgElement.outerHTML, async (base64File: File) => {
      // let { ipfsHash } = await uploadFileToIPFS(base64File, `Project ${id}.png`);

      // const metadata = {
      //   name: `Project ${id}`,
      //   description: JSON.stringify(objects),
      //   "image": `ipfs://${ipfsHash}`, //pinataURL,
      //   "attributes": []
      // }

      // let { ipfsHash: jsonHash } = await uploadJSONToIPFS(metadata); 

      const nftstorage = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDA3MmUyMzY0MkQxMjkxZjllZDU2NzRGNGU0QzQyMzI1YURmZTRCYjAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1OTA3NDQyOTI0OSwibmFtZSI6IlNwbGFzaCJ9.YpUTurdwRoPvXHhZyeY9EVQcmQ5fXeTSkoIOjdP0T10' });

      const { url: jsonHash} = await nftstorage.store({
          image: base64File,
          name,
          description: JSON.stringify(objects),
          tags,
          properties: { "attributes": [] },
      })
      console.log(jsonHash);

      await updateURI(id, jsonHash); 
      history.goBack();
    });
  };

  const onCreate = async () => {
    const svgElement = document.getElementById('project-svg')!;

    svgToPng(`${name}.png`, svgElement.outerHTML, async (base64File: File) => {
      const nftstorage = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDA3MmUyMzY0MkQxMjkxZjllZDU2NzRGNGU0QzQyMzI1YURmZTRCYjAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1OTA3NDQyOTI0OSwibmFtZSI6IlNwbGFzaCJ9.YpUTurdwRoPvXHhZyeY9EVQcmQ5fXeTSkoIOjdP0T10' });

      const { url: jsonHash} = await nftstorage.store({
          image: base64File,
          name,
          description: JSON.stringify(objects),
          tags,
          properties: { "attributes": [] },
      })
      console.log(jsonHash);

      await createProject(0, jsonHash); 
      history.goBack();
    });
  };

  useEffect(() => {
    let newObjects: any[] = []
    if (projectDescription && projectDescription.startsWith("[")) {
      newObjects = JSON.parse(projectDescription);
    }
    constituents && constituents.forEach(x => {
      if (x.description && x.description.startsWith("[")) {
        newObjects = ([...newObjects, ...(JSON.parse(x.description))])
      }
    })
    setObjects(newObjects)
  }, [projectDescription, constituents])

  useEffect(() => {
    setName(projectName);
  }, [projectName])

  useEffect(() => {
    setTags(projectTags);
  }, [projectTags])

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
        <TextField label="Name" value={name} onChange={(e) => {
          setName(e.target.value);
        }}/>
        <Box height={20}/>
        <TextField label="Tags" value={tags} onChange={(e) => {
          setTags(e.target.value);
        }}/>
        <Box height={40}/>
        <Card sx={{ maxWidth: 345 }}>
          <CardContent style={{ backgroundColor: "lightgray" }}>
              <Typography variant="body2" color="text.secondary">
                  Click {(id === "new" ? "CREATE" : "SAVE")} to exit the project!
              </Typography>
          </CardContent>
          <CardActions>
              <Button size="small" color="primary" onClick={() => {
                if (id === "new" && createProjectState.status !== "Mining") { 
                  onCreate()
                } else if (updateURIState.status !== "Mining") { 
                  onExit()
                }                          
              }}>
              {(createProjectState.status === "Mining" || updateURIState.status === "Mining") 
                ? "Mining..." 
                : (id === "new" ? "Create" : "Save")} 
              </Button>
          </CardActions>
        </Card>
        <Box height={40}/>
        <List sx={{ width: '100%', maxWidth: 360 }}>
          {(constituents || []).map((c, index) => (
            <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={c.name} src={c.image.replace("ipfs://", "https://ipfs.io/ipfs/")} />
            </ListItemAvatar>
            <ListItemText
              primary={c.name}
              secondary={
                <>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {c.tags}
                  </Typography>
                </>
              }
            />
            <Divider variant="inset" component="li" />
            </ListItem>
          ))}
        </List>
      </Stack>
        <Box width={40}/>
        <Grid container spacing={2}>
            {Object.entries(projects).map(([projectId, project]) => (
                <ProjectCard project={project} key={projectId} 
                title={addState.status === "Mining" ? "Mining..." : "Add"} 
                showBuy={false}
                showRemixCount={true}
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
    </>
  )
}

export default ProjectPage;
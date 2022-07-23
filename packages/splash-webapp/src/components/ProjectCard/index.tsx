import { ProjectState } from '../../state/slices/project';
import { useEffect } from 'react';
import { Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material"
import { setProjectData } from '../../state/slices/projects';
import { useAppDispatch, useAppSelector } from '../../hooks';


const ProjectCard: React.FC<{ project: ProjectState, title: string, onClose?: (projectData: any, price: string) => Promise<void> }> = props => {
  const { id, uri, price } = props.project;
  const projectData: any = useAppSelector(state => state.projects.projects[id].data);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        const response = await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/"), {
          // mode: 'no-cors'
        });
        const data = await response.json();
        dispatch(setProjectData({ id, data }));
      } catch (error) {
        
      }
    }

    loadProjectData();
  }, [uri, dispatch, id])

  return (
    <Grid item>
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            sx={{ width: 200, height: 200, objectFit: 'contain' }}
            image={projectData.image ? projectData.image.replace("ipfs://", "https://ipfs.io/ipfs/") : null}
          />
          <CardContent style={{ backgroundColor: "lightgray" }}>
            <Typography gutterBottom variant="body2" component="div" textAlign={"center"}>
                {projectData["name"]}
            </Typography>
            {/* <Typography variant="body2" color="text.secondary">
                {projectData["description"]}
            </Typography> */}
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" onClick={() => {
              props.onClose && props.onClose(projectData, price);
            }}>
            {props.title}
            </Button>
          </CardActions>
        </Card>
    </Grid>
  )
};

export default ProjectCard;

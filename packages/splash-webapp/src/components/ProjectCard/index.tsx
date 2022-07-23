import { ProjectState } from '../../state/slices/project';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, CircularProgress, Divider, Grid, Stack, Typography } from "@mui/material"
import { setProjectData } from '../../state/slices/projects';
import { useAppDispatch, useAppSelector } from '../../hooks';


const ProjectCard: React.FC<{ project: ProjectState, isHome: Boolean }> = props => {
  const { id, uri } = props.project;
  const history = useHistory();
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
  }, [uri])

  return (
    <Grid item>
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
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
                      if (props.isHome) {
                        history.push(`/project/${id}`);
                      }
                    }}>
                    {props.isHome ? "EDIT" : "ADD"}
                    </Button>
                </CardActions>
            </CardActionArea>
        </Card>
    </Grid>
  )
};

export default ProjectCard;

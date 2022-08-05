import ProjectCard from "../../components/ProjectCard";
import { useAppSelector } from "../../hooks";
import { Box, Button, Card, CardActions, CardContent, CircularProgress, Divider, Grid, Stack, TextField, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { searchQuery } from "../../wrappers/subgraph";
import { useState } from "react";
import { ProjectsState } from "../../state/slices/projects";

interface HomePageProps {
  
}

const HomePage: React.FC<HomePageProps> = props => {
  const [searchString, setSearchString] = useState<string>("");

  const history = useHistory();
  const projects = useAppSelector(state => state.projects.projects);

  const { data } = useQuery(searchQuery(searchString));
  const searchedProjects: ProjectsState = { "projects": (data && data.search) || [] }

  return (
    <Stack padding={"10px"}>
        <Box height={20}/>
        <TextField variant="outlined" label="Search" onChange={(e) => {
          setSearchString(e.target.value);
        }}/>
        <Box height={40}/>
        {searchString !== "" ?
        (<Grid container spacing={2}>
            {Object.entries(searchedProjects.projects).map(([projectId, project]) =>  (
                <ProjectCard project={project} key={projectId} title={"Open"} showBuy={false} onClose={async () => {
                  history.push(`/project/${projectId}`);
                }} />
            ))}
        </Grid>) :
        (
        <>
          <Card sx={{ maxWidth: 345 }}>
            <CardContent style={{ backgroundColor: "lightgray" }}>
                <Typography variant="body2" color="text.secondary">
                    Click CREATE to create a new project!
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={() => {
                  history.push(`/project/new`);
                      
                }}>
                {"Create"} 
                </Button>
            </CardActions>
          </Card>
          <Box height={40}/>
          <Typography variant="h5">
              My Projects
          </Typography>
          <Divider />
          <Box height={40}/>
          { projects == null ? 
            (<div style={{display: 'flex', justifyContent: 'center'}}>
              <CircularProgress />
            </div>) :
            (<Grid container spacing={2}>
                {Object.entries(projects).map(([projectId, project]) =>  (
                    <ProjectCard project={project} key={projectId} title={"Open"} 
                    showBuy={false}
                    showConstituentCount={true} 
                    onClose={async () => {
                      history.push(`/project/${projectId}`);
                    }} />
                ))}
            </Grid>)
          }
        </>
        )}
    </Stack>
  )
}

export default HomePage;
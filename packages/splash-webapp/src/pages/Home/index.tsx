import ProjectCard from "../../components/ProjectCard";
import { useAppSelector } from "../../hooks";
import { Box, Button, Card, CardActions, CardContent, CircularProgress, Divider, Grid, Stack, TextField, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";

interface HomePageProps {
  
}

const HomePage: React.FC<HomePageProps> = props => {
  const history = useHistory();
  const projects = useAppSelector(state => state.projects.projects);

  return (
    <Stack padding={"10px"}>
        {/* <Box height={20}/>
        <TextField variant="outlined" label="Search"/> */}
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
        { projects == null 
        ? 
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <CircularProgress />
        </div>
        :
        <Grid container spacing={2}>
            {Object.entries(projects).map(([projectId, project]) =>  (
                <ProjectCard project={project} key={projectId} title={"Open"} onClose={async () => {
                  history.push(`/project/${projectId}`);
                }} />
            ))}
        </Grid>
        }
    </Stack>
  )
}

export default HomePage;
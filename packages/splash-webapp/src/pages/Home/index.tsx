import { SplashProjectFactory } from "@splash/sdk";
import { useContractFunction } from "@usedapp/core";
import ProjectCard from "../../components/ProjectCard";
import config from "../../config";
import { useAppSelector } from "../../hooks";
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CircularProgress, Divider, Grid, Stack, Typography } from "@mui/material";

interface HomePageProps {
  
}

const HomePage: React.FC<HomePageProps> = props => {
  const splashProjectContract = new SplashProjectFactory().attach(
    config.addresses.splashProject,
  );

  const projects = useAppSelector(state => state.projects.projects);

  const { send: createProject, state: createProjectState } = useContractFunction(
    splashProjectContract,
    'create',
  );

  return (
    <Stack padding={"10px"}>
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
                        Click CREATE to create a new project!
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary" onClick={() => {
                            if (createProjectState.status !== "Mining") { 
                              createProject(10)
                            }                          
                    }}>
                    {createProjectState.status === "Mining" ? "Mining..." : "Create"} 
                    </Button>
                </CardActions>
            </CardActionArea>
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
            {projects.map((project, indx) => (
                <ProjectCard project={project} key={indx} />
            ))}
        </Grid>
        }
    </Stack>
  )
}

export default HomePage;
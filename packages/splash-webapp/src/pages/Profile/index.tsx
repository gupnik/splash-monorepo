import ProjectCard from "../../components/ProjectCard";
import { Box, CircularProgress, Grid, Stack } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { projectsQuery } from "../../wrappers/subgraph";
import { useEffect, useState } from "react";
import { ProjectState } from "../../state/slices/project";

interface ProfilePageProps {
  
}

const ProfilePage: React.FC<ProfilePageProps> = props => {
  const { id } = useParams<{ id: string }>();
  const { data } = useQuery(projectsQuery(id));
  const history = useHistory();
  const [projects, setProjects] = useState<ProjectState[]>([]);


  useEffect(() => {
    if (!data || !data.splashAccount) return;
    const projectsData = data.splashAccount.projects as any[];
    setProjects(projectsData.map(project => {
      return {
        id: project.id,
        uri: project.uri,
        price: project.price,
        name: project.name,
        description: project.description,
        image: project.image,
        supply: project.supply,
        consumers: project.consumers.map((x: any) => {
          return {
          id: x.project.id,
          price: x.project.price,
          name: x.project.name,
          description: x.project.description,
          image: x.project.image,
          supply: x.project.supply,
        }}),
        constituents: project.constituents.map((x: any) => {
          return {
            id: x.constituent.id,
            price: x.constituent.price,
            name: x.constituent.name,
            description: x.constituent.description,
            image: x.constituent.image,
            supply: x.constituent.supply,
          }
        })
      }
    }));
  }, [data])

  return (
    <Stack padding={"10px"}>
        <Box height={40}/>
        { projects == null 
        ? 
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <CircularProgress />
        </div>
        :
        <Grid container spacing={2}>
            {Object.entries(projects).map(([projectId, project]) =>  (
                <ProjectCard project={project} key={projectId} title={"Remix"} 
                showRemixCount={true}
                showBuy={true} onClose={async () => {
                  history.push(`/project/${projectId}`);
                }} />
            ))}
        </Grid>
        }
    </Stack>
  )
}

export default ProfilePage;
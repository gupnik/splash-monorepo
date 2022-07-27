import { ProjectState } from '../../state/slices/project';
import { Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material"


const ProjectCard: React.FC<{ project: ProjectState, title: string, onClose?: (description: string, price: string) => Promise<void> }> = props => {
  const { price, name, description, image } = props.project;

  return (
    <Grid item>
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            sx={{ width: 200, height: 200, objectFit: 'contain' }}
            image={image.replace("ipfs://", "https://ipfs.io/ipfs/")}
          />
          <CardContent style={{ backgroundColor: "lightgray" }}>
            <Typography gutterBottom variant="body2" component="div" textAlign={"center"}>
                {name}
            </Typography>
            {/* <Typography variant="body2" color="text.secondary">
                {projectData["description"]}
            </Typography> */}
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" onClick={() => {
              props.onClose && props.onClose(description, price);
            }}>
            {props.title}
            </Button>
          </CardActions>
        </Card>
    </Grid>
  )
};

export default ProjectCard;

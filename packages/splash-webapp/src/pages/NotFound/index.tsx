import { Col, Image } from 'react-bootstrap';
import Section from '../../layout/Section';
import classes from './NotFound.module.css';

const NotFoundPage = () => {
  return (
    <Section fullWidth={false}>
      <Col lg={4}>
        {/* <Image src={} fluid /> */}
      </Col>
      <Col lg={8}>
        <h1 className={classes.heading}>
          404: This is not the person, place, or thing you're looking for...
        </h1>
      </Col>
    </Section>
  );
};
export default NotFoundPage;

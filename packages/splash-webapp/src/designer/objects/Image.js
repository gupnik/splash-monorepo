import Icon from '../Icon';
import Vector from './Vector';

export default class Image extends Vector {
  static meta = {
    icon: <Icon icon={'image'} size={30} />,
    initial: {
      width: 100,
      height: 100,
      // Just a simple base64-encoded outline
      xlinkHref: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAhSURBVHgBtYmxDQAADII8lv9faBNH4yoJLAi4ppxgMZoPoxQrXYyeEfoAAAAASUVORK5CYII="
    }
  };

  render() {
    let {object} = this.props;
    return (
      <image
         xlinkHref={object.xlinkHref}
         {...this.getObjectAttributes()}
         width={object.width}
         height={object.height} />
    );
  }
}

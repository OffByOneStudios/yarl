
import Context from './context';
import Documentable from './documentable';

function Routable(name) {
  return (target) => {
    if(name === false) {return target;}
    const n = (name) ? name : target.name;
    if(n in Context.Routes) {
      console.info(`Route ${n} Is Overriding ${Context.Routes[n]}`);
    }
    Context.Routes[n] = (routeProps) => {return target};
    return target;
  }
}

export default Documentable({
  text: `
  Decorator which registers a component to be mounted on a specific route
  `,
  args: {
    route: `String name of route, or false if the component should be unroutable`
  }
})(Routable);

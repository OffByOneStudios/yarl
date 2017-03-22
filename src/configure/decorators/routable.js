
import {Documentable} from './documentable';

let Routes = {};

function Routable(name) {
  return (target) => {
    if(name === false) {return target;}
    const n = (name) ? name : target.name;
    if(n in Routes) {
      console.warn(`Route ${n} already refers to ${routes[n]}`);
    }
    else {
      Routes[n] = (routeProps) => {return target};
    }
    return target;
  }
}

Documentable({
  text: `
  Decorator which registers a component to be mounted on a specific route
  `,
  args: {
    route: `String name of route, or false if the component should be unroutable`
  }
})(Routable);


export {Routes};
export {Routable};

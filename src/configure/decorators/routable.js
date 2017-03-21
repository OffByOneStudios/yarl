
let Routes = {};

function Routable(target, name) {
  const n = (name) ? name : target.name;
  if(n in Routes) {
    console.warn(`Route ${n} already refers to ${routes[n]}`);
  }
  else {
    Routes[n] = (routeProps) => {return target};
  }

  return target;
}

export {Routes};
export {Routable};

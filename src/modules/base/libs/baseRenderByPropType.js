'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'

import Tagable from '../../../configure/libs/tagable'

import React, {Component, PropTypes} from 'react';

function valueFor(moduleName, componentName, propName, prop, type) {
  if(type === PropTypes.array) {
    return (
      <ol className={`${moduleName}-${componentName}-${propName}-value`}>
        {
          prop.map((e, i) => {
            return (
              <li key={i} className={`${moduleName}-${componentName}-${propName}-value-item`}>
                {e}
              </li>
            )
          })
        }
      </ol>
    );
  }

  else if(type === PropTypes.object) {
    return (
      <ul className={`${moduleName}-${componentName}-${propName}-value`}>
        {
          Object.keys(prop).map((e, i) => {
            return (
              <li key={i} className={`${moduleName}-${componentName}-${propName}-value-item`}>
                {e}: {prop[e]}
              </li>
            )
          })
        }
      </ul>
    );
  }

  else if(type === PropTypes.bool) {
    return (
      <div className={`${moduleName}-${componentName}-${propName}-value-${prop}`}>
        {prop}
      </div>
    );
  }

  else if(type === PropTypes.func) {
    return (
      <div onClick={(e)=>{prop(e)}} className={`${moduleName}-${componentName}-${propName}-value-${prop}`}>
        {prop.name}
      </div>
    );
  }

  else if(type === PropTypes.string || type  === PropTypes.number) {
    return (
      <div className={`${moduleName}-${componentName}-${propName}-value-${prop}`}>
        {prop}
      </div>
    );
  }

  else {
    return (
      <div className={`${moduleName}-${componentName}-${propName}-value-${container}`}>
        {prop}
      </div>
    );
  }

}

function baseRenderByPropType(moduleName, componentName, props, propTypes) {

  const body = Object.keys(propTypes).map((e, i) => {
    return (
      <div key={i} className={`${moduleName}-${componentName}-${e}-container`}>
        <div className={`${moduleName}-${componentName}-${e}-label`}>
          {e}
        </div>
        <div className={`${moduleName}-${componentName}-${e}-value-container`}>
          {valueFor(moduleName, componentName, e,  props[e], propTypes[e])}
        </div>
      </div>
    );
  });
  return (
    <div className={`${moduleName}-${componentName}-container`} >
      {body}
    </div>
  );
}

export default compose (
  Documentable({
      text: `# baseRenderByPropType`,
      args: {
        propType: 'Arg 0',
        propValue: 'Arg 1'
      }
  }),

  Tagable({platform: 'any'})
)(baseRenderByPropType);

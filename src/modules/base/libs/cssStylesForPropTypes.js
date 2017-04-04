'use babel'
import {compose} from 'redux';
import Documentable from '../../../configure/libs/documentable'


function valueFor(propType) {
  return [

  ];

}

function cssStylesForPropTypes(moduleName, componentName, propTypes) {
  return [
    `${moduleName}-${componentName}-container`,
    ...propTypes.map((e, i) => {
      return [
        `${moduleName}-${componentName}-${e.name}-container`,
        `${moduleName}-${componentName}-${e.name}-label`,
        `${moduleName}-${componentName}-${e.name}-value-container`,
        ...valueFor(e)
      ]
    })
  ];
}

export default compose (
  Documentable({
  text: `# cssStylesForPropTypes`,
  args: {
    moduleName: `This Module's Home`,
    componentName: `Name of this StyleSheet, hopefully backed by a component`,
    propTypes: 'Array of {name, type} object'
  }
}),



)(cssStylesForPropTypes);

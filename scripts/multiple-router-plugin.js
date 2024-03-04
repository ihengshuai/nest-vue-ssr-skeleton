const { declare } = require("@babel/helper-plugin-utils");

const multipleRouterPlugin = declare((api) => {
  api.assertVersion(7);

  function createIdentifier(t, name) {
    return t.objectProperty(t.identifier(name), t.identifier(name), false, true);
  }

  return {
    visitor: {
      ExportNamedDeclaration(path) {
        const { specifiers, source } = path.node;

        if (specifiers && specifiers.length && source && /^@\/components\/layout\/(index\.vue|App.tsx)$/.test(source.value)) {
          const [exportSpecifier] = specifiers;
          const { exported } = exportSpecifier;

          if (api.types.isExportSpecifier(exportSpecifier) && /^(Layout|App)$/.test(exported.name)) {
            path.remove();
          }
        }
      },
      VariableDeclarator(path) {
        const { init, id } = path.node;

        if (init && id) {
          const { object, property } = init;

          if (object && property && object.name === "create_router_1" && property.name === "Routes") {
            path.node.id.properties.push(createIdentifier(api.types, "CustomRoutes"));
            path.node.id.properties.push(createIdentifier(api.types, "customCreateRouter"));
          }
        }
      },
      CallExpression(path) {
        const { callee, arguments: _arguments } = path.node;
        if (api.types.isSequenceExpression(callee)) {
          const { expressions } = path.node.callee;
          if (expressions && expressions.length === 2) {
            const [, member] = expressions;

            if (api.types.isMemberExpression(member) && member.object) {
              if (/^ssr_(client|server)_utils_1$/.test(member.object.name) && _arguments && _arguments.length === 2) {
                const [route] = _arguments;

                if (route.name === "FeRoutes") {
                  _arguments.shift();
                  _arguments.unshift(api.template.expression("CustomRoutes !== null && CustomRoutes !== void 0 ? CustomRoutes : FeRoutes")());
                }
              }

              if (member.object.name === "create_1" && member.property && member.property.name === "createRouter") {
                callee.expressions = [
                  api.types.NumericLiteral(0),
                  api.template.expression("customCreateRouter !== null && customCreateRouter !== void 0 ? customCreateRouter : create_1.createRouter")()
                ];

                if (!_arguments.length) {
                  path.node.arguments = [
                    createIdentifier(api.types, "undefined"),
                    createIdentifier(api.types, "ctx")
                  ];
                }
              }
            }
          }
        }
      }
    }
  };
});
module.exports = multipleRouterPlugin;

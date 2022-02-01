// For help writing plugins, visit the documentation to get started:
//   https://support.insomnia.rest/article/173-plugins

module.exports.requestActions = [
  {
    label: "Fast-Weigh: Copy Telerik Body",
    action: async (context, data) => {
      const { request } = data;
      let body = JSON.parse(request.body.text);
      let telerikBody = {};
      let variables = [];
      telerikBody.query = body.query;
      telerikBody.variables = {};

      if (typeof body.variables !== "undefined") {
        // map over variables and create @params
        Object.keys(body.variables).forEach((key) => {
          const telerikParam = "@" + key;
          telerikBody.variables[key] = telerikParam;

          // push variable type to variables array
          if (Array.isArray(body.variables[key])) {
            // typeof array
            variables.push({ telerikParam: "array" });
          } else {
            variables.push({ telerikParam: typeof body.variables[key] });
          }
        });
      }

      telerikJsonBody = JSON.stringify(telerikBody, null, 2);

      // strip quotes from array parameters and int/float parameters
      variables.forEach((variable) => {
        if (variable.telerikParam === "array") {
          telerikJsonBody = telerikJsonBody.replace(
            '"@' + variable.telerikParam + '"',
            "[" + "@" + variable.telerikParam + "]"
          );
        } else if (
          variable.telerikParam === "number" ||
          variable.telerikParam === "bigint" ||
          variable.telerikParam === "undefined" ||
          variable.telerikParam === "boolean"
        ) {
          telerikJsonBody = telerikJsonBody.replace(
            '"@' + variable.telerikParam + '"',
            "@" + variable.telerikParam
          );
        }
      });

      // write text to clipboard
      navigator.clipboard.writeText(telerikJsonBody);

      const html = `
        <div style="padding: 20px 20px 20px 20px;">
          <h1 style="margin-bottom: 20px;">Copied to clipboard!</h1>
          <hr />
<pre style="margin-top: 20px;">
<code>
${telerikJsonBody}
</code>
</pre>
        </div>`;
      context.app.showGenericModalDialog("Telerik Body", { html });
    },
  },
];

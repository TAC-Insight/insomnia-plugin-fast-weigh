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
          // set object to push to variables array
          let telerikParamObj = {};
          telerikParamObj[telerikParam] = body.variables[key];
          // add the variable to telerikBody
          telerikBody.variables[key] = telerikParam;

          // push variable type to variables array
          if (Array.isArray(body.variables[key])) {
            // typeof array
            telerikParamObj[telerikParam] = "array";
            variables.push(telerikParamObj);
          } else {
            telerikParamObj[telerikParam] = typeof body.variables[key];
            variables.push(telerikParamObj);
          }
        });
      }

      let telerikJsonBody = JSON.stringify(telerikBody, null, 2);

      // strip quotes from array parameters and int/float parameters
      console.log(variables);
      variables.forEach((variable) => {
        key = Object.keys(variable)[0];
        console.log("key: " + key);
        console.log("key value: " + variable[key]);
        if (variable[key] === "array") {
          console.log("Replacing array: " + key);
          telerikJsonBody = telerikJsonBody.replace(
            '"' + key + '"',
            "[" + key + "]"
          );
          console.log("telerikJsonBody: " + telerikJsonBody);
        } else if (
          variable[key] === "number" ||
          variable[key] === "bigint" ||
          variable[key] === "undefined" ||
          variable[key] === "boolean"
        ) {
          telerikJsonBody = telerikJsonBody.replace('"' + key + '"', key);
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

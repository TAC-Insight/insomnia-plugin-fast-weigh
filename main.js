// For help writing plugins, visit the documentation to get started:
//   https://support.insomnia.rest/article/173-plugins

module.exports.requestActions = [
  {
    label: "Fast-Weigh: Copy Telerik Body",
    action: async (context, data) => {
      const { request } = data;
      let body = JSON.parse(request.body.text);
      let telerikBody = {};
      telerikBody.query = body.query;
      telerikBody.variables = {};

      if (typeof body.variables !== "undefined") {
        // map over variables and create @params
        Object.keys(body.variables).forEach((key) => {
          telerikBody.variables[key] = "@" + key;
        });
      }

      telerikJsonBody = JSON.stringify(telerikBody, null, 2);
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

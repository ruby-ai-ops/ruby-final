import sgMail from "@sendgrid/mail";

import { frontSequelize } from "@app/lib/resources/storage";

const { SENDGRID_API_KEY = "", LIVE = false } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

export const sendAPIUserEmail = async ({
  user_email,
  workspace_id,
}: {
  user_email: string;
  workspace_id: string;
}) => {
  const msg = {
    to: user_email,
    from: "team@ruby.ad",
    subject: "[Ruby] Product Update 1",
    html: `<p>Hi!</p>
    <p style="max-width: 500px;">
      <a href="https://app.ruby.ad/w/${workspace_id}">Ruby</a> makes work work better with custom AI agents.
    </p>
    <p style="max-width: 500px;">
      The past month has been packed with powerful new features and upgrades.
    </p>

    <p style="max-width: 500px; padding-top: 20px;">
      <b>⛵️ Mistral Large Now Available</b><br/>
      • You can now access Mistral Large via the new @mistral-large global agent (you can also use it to build custom agents).<br/>
      • Mistral Large, is the latest and most advanced language model from Mistral.<br/>
      🔗 <a href="https://mistral.ai/news/mistral-large/">https://mistral.ai/news/mistral-large/</a>
    </p>

    <p style="max-width: 500px; padding-top: 20px;">
      <b>🧠 New Cutting-Edge Models from Anthropic</b><br/>
      • Claude 3 Opus is now powering the @claude-3 global agent, delivering a major performance boost over Claude 2.1.<br/>
      • Opus is Anthropic's most intelligent model, with best-in-market performance and a very lage context window (200k tokens).<br/>
      • All custom agents using Claude 2.1 have been automatically upgraded to Claude 3 Opus.<br/>
      🔗 <a href="https://www.anthropic.com/news/claude-3-family">https://www.anthropic.com/news/claude-3-family</a>
    </p>

    <p style="max-width: 500px; padding-top: 20px;">
      <b>📊 Introducing Table Queries</b><br/>
      • Create custom agents to perform quantitative queries on Notion databases, Google Sheets, and CSV.<br/>
      • Ask questions like "Show me top customers by revenue" and get back instant insights.<br/>
      • Enable everyone to make data-informed decisions without needing SQL or analytics expertise.<br/>
      🔗 <a href="https://blog.ruby.ad/rubys-for-quantitative-analysis-with-llms/">https://blog.ruby.ad/rubys-for-quantitative-analysis-with-llms/</a>
    </p>

    <p style="max-width: 500px; padding-top: 20px;">
      <b>📘 Confluence Connection</b><br/>
      • Connect your Confluence instance to Ruby to sync global spaces and pages.<br/>
      • Simply add Confluence as a data source and let your agents tap into that collective wisdom.<br/>
    </p>

    <p style="max-width: 500px; padding-top: 20px;">
      <b>💬 Intercom Connection</b><br/>
      • Connect Intercom to sync Help Center articles and customer conversations to Ruby.<br/>
      • Choose which Teams to sync conversations from and control access to customer data.<br/>
    </p>

    <p style="max-width: 500px; padding-top: 20px;">
      <b>🔒 Okta Single Sign-On</b><br/>
      • Enterprise customers can ask to enable Okta SSO for an even more seamless and secure authentication experience. Simplify user management by leveraging your existing Okta setup.<br/>
    </p>

    <p style="max-width: 500px; padding-top: 20px;">
      <b>🤖 Summon Agents in Slack</b><br/>
      • Interact with any Ruby agent right from Slack using the @ruby ~agentname or @ruby +agentname syntax. Bring the power of Ruby to the tools you use every day.<br/>
    </p>

    <p style="max-width: 500px; padding-top: 20px;">
      <b>📘 Quick Start Guide</b><br/>
      • We've added a handy walkthrough on first login to explain Ruby fundamentals and help new users get oriented. Be sure to check it out!<br/>
    </p>

    <p style="max-width: 500px; padding-top: 20px;">
      <b>🏗️ Ruby Builders Sessions #1</b><br/>
      • Tune in on March 14th for our first Ruby Sessions for Builders webinar! Folks from Alan, Pennylane, and Payfit will be demoing their innovative support and sales agents.<br/>
      • Admin and Builders, save your spot now! Send an email to <a href="mailto:pauline@ruby.ad">pauline@ruby.ad</a>.
    </p>

    <p style="max-width: 500px; padding-top: 20px;">
      <b>➕ And more...</b><br/>
      • Refreshed agent details page and builder UX.<br/>
      • Experimental instruction suggestions and website crawling settings.<br/>
      • New blog posts: <a href="https://blog.ruby.ad/pennylane-ruby-customer-support-journey/">How Eléonore improved the efficiency of Pennylane’s Care team thanks to Ruby</a> and <a href="https://blog.ruby.ad/why-ruby/">Why Ruby</a>.<br/>
    </p>

    <p style="max-width: 500px; padding-top: 20px;">
      Happy building,
    </p>
    <p>
      The Ruby Team
    </p>
    <p style="max-width: 500px; padding-top: 20px; color: #888;">
      PS: Simply reply to this email with any questions (or if you wish to unsubscribe from these updates). We're here to help!
    </p>
`,
  };

  await sgMail.send(msg);

  console.log("EMAIL SENT", user_email);
};

async function main() {
  const [rows] = await frontSequelize.query(
    `
SELECT "u".email user_email, "w"."sId" workspace_id
FROM "users" "u"
JOIN "memberships" "m" ON "u"."id" = "m"."userId"
JOIN "workspaces" "w" ON "m"."workspaceId" = "w"."id"
JOIN "subscriptions" "s" ON "w"."id" = "s"."workspaceId"
WHERE "s"."status" = 'active'
AND ("m"."startAt" <= NOW()) AND ("m"."endAt" IS NULL OR "m"."endAt" >= NOW());
    `
  );

  console.log({ count: rows.length });

  // split rows in chunks of 16
  const chunks: { user_email: string; workspace_id: string }[][] = [];
  let chunk: { user_email: string; workspace_id: string }[] = [];
  for (let i = 0; i < rows.length; i++) {
    chunk.push(rows[i] as { user_email: string; workspace_id: string });
    if (chunk.length === 16) {
      chunks.push(chunk);
      chunk = [];
    }
  }
  if (chunk.length > 0) {
    chunks.push(chunk);
  }

  //const chunks: { user_email: string }[][] = [[{ user_email: "team@ruby.ad" }]];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log("SENDING CHUNK", i, chunk.length);
    await Promise.all(
      chunk.map((row) => {
        console.log("PREPARING EMAIL", row.user_email, row.workspace_id);
        if (LIVE && LIVE === "true") {
          return sendAPIUserEmail(row);
        } else {
          return Promise.resolve();
        }
      })
    );
  }

  process.exit(0);
}

void main().then(() => {
  console.log("DONE");
  process.exit(0);
});

# Introduction

> AI coding tools let you ship 10x faster, but code reviews still take days. CodeRabbit solves the AI coding bottleneck with context-aware reviews that learn from your team's preferences.

This page provides a conceptual introduction to CodeRabbit. For hands-on setup, see [Quickstart](/getting-started/quickstart/).

AI coding tools like Cursor and Claude Code let you write code 10x faster. But code reviews still happen manually. Senior engineers spend days reviewing AI-generated PRs. The queue backs up. Teams get stuck.

CodeRabbit solves this AI coding bottleneck with context-aware reviews that actually understand your codebase - not just the code you changed, but how it connects to your architecture, follows your patterns, and affects downstream dependencies.

<iframe width="100%" height="400" src="https://www.youtube.com/embed/3SyUOSebG7E?si=i0oT9RAnH0PW81lY" title="CodeRabbit AI code review demonstration" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />

## Core capabilities

CodeRabbit delivers human-like reviews through three core capabilities:

### 1. Easier to review pull requests

Skip the diff diving. Get context fast.

<CardGroup cols={2}>
  <Card title="Summary" icon="file-text">
    AI-generated summary of what changed and why it matters to your system
    architecture.
  </Card>

  <Card title="Walkthrough" icon="list">
    File-by-file breakdown showing exactly what each change does.
  </Card>

  <Card title="Diagram" icon="workflow">
    Visual flow diagram showing how changes affect your system architecture.
  </Card>

  <Card title="Chat to learn" icon="messages-square">
    Ask CodeRabbit questions about the changes in natural language.
  </Card>
</CardGroup>

### 2. Context-aware code analysis

Reviews code like a senior dev who knows your entire codebase.

<CardGroup cols={1}>
  <Card title="CodeRabbit learns from every interaction" icon="graduation-cap" color="#FF570A">
    Tell CodeRabbit you prefer 2-space indentation over 4-space, or want more
    focus on security. It remembers and applies these preferences across all
    future reviews in your repository. **Example**: When CodeRabbit suggests
    4-space indentation but your team uses 2-space, reply in the PR comment.
    CodeRabbit acknowledges the feedback and adjusts all subsequent reviews
    accordingly. [See how learning works
    →](https://www.youtube.com/watch?v=Yu0cmmOYA-U)
  </Card>
</CardGroup>

<CardGroup cols={2}>
  <Card title="Code guidelines" icon="scan-text">
    Automatically detects and applies your team's coding standards and patterns.
  </Card>

  <Card title="Code graph" icon="git-branch">
    Maps dependencies and downstream effects of your changes across the
    codebase.
  </Card>
</CardGroup>

<CardGroup cols={3}>
  <Card title="Sandbox" icon="flask-conical">
    Creates ephemeral environments for code exploration.
  </Card>

  <Card title="40+ linters" icon="settings">
    Runs industry-standard analyzers and synthesizes results into actionable
    feedback.
  </Card>

  <Card title="Web search" icon="search">
    Fetches up-to-date information about libraries and frameworks in your code.
  </Card>

  <Card title="AI code reviews" icon="bot">
    Catches race conditions, security holes, and architectural drift that
    pattern matching misses.
  </Card>

  <Card title="Code suggestions" icon="lightbulb">
    Provides committable fixes you can apply with one click.
  </Card>

  <Card title="Linked issues" icon="link-2">
    Verifies that PR changes actually address the linked issues.
  </Card>
</CardGroup>

<Tip>
  **Free for public repositories**: Get full Pro tier features at no cost for
  open source projects. Rate limits may apply.
</Tip>

### 3. Automatic finishing touches

Handle the polish that makes code professional.

<CardGroup cols={2}>
  <Card title="Unit tests" icon="test-tube">
    Generate comprehensive tests covering edge cases with one click.
  </Card>

  <Card title="Docstrings" icon="file-text">
    Write clear documentation for functions and complex logic automatically.
  </Card>
</CardGroup>

## Embedded in your pull requests

CodeRabbit reviews happen where you already work - as comments on your PRs. Each review considers the full context of your codebase, not just the changed files.

Every review runs your changes through 40+ industry-standard tools - linters, security analyzers, performance checkers. CodeRabbit synthesizes all this into human-readable feedback that highlights what actually matters.

Chat with CodeRabbit directly in PR comments. Ask questions, provide context, or give feedback on its review style. CodeRabbit learns from every interaction and applies your preferences to future reviews.

<Accordion title="Advanced configuration options">
  Beyond chat learning, you can:

  * [Add configuration files](/getting-started/yaml-configuration) for repository-wide settings
  * Set [path-based instructions](/guides/review-instructions) for how different parts of your codebase should be reviewed
  * Customize review focus areas through the CodeRabbit web interface

  CodeRabbit works out of the box with sensible defaults, delivering meaningful reviews within minutes of setup.
</Accordion>

### Supports major Git platforms

Integration takes minutes across popular platforms:

<CardGroup cols={2}>
  <Card title="GitHub" icon="github" href="/platforms/github-com">
    GitHub, GitHub Enterprise Cloud, GitHub Enterprise Server
  </Card>

  <Card title="GitLab" icon="gitlab" href="/platforms/gitlab-com">
    GitLab, GitLab Self-Managed
  </Card>

  <Card
    title="Azure DevOps"
    icon={
  		<svg
  			id="f4337506-5d95-4e80-b7ca-68498c6e008e"
  			xmlns="http://www.w3.org/2000/svg"
  			viewBox="0 0 18 18"
  		>
  			{" "}
  			<defs>
  				{" "}
  				<linearGradient
  					id="ba420277-700e-42cc-9de9-5388a5c16e54"
  					x1="9"
  					y1="16.97"
  					x2="9"
  					y2="1.03"
  					gradientUnits="userSpaceOnUse"
  				>
  					{" "}
  					<stop offset="0" stop-color="#FF570A" />{" "}
  					<stop offset="0.16" stop-color="#FF570A" />{" "}
  					<stop offset="0.53" stop-color="#FF570A" />{" "}
  					<stop offset="0.82" stop-color="#FF570A" />{" "}
  					<stop offset="1" stop-color="#FF570A" />{" "}
  				</linearGradient>{" "}
  			</defs>{" "}
  			<title>Icon-devops-261</title>{" "}
  			<path
  				id="a91f0ca4-8fb7-4019-9c09-0a52e2c05754"
  				d="M17,4v9.74l-4,3.28-6.2-2.26V17L3.29,12.41l10.23.8V4.44Zm-3.41.49L7.85,1V3.29L2.58,4.84,1,6.87v4.61l2.26,1V6.57Z"
  				fill="url(#ba420277-700e-42cc-9de9-5388a5c16e54)"
  			/>{" "}
  		</svg>
  	}
    href="/platforms/azure-devops"
  >
    Azure DevOps
  </Card>

  <Card title="Bitbucket" icon="bitbucket" href="/platforms/bitbucket-cloud">
    Bitbucket Cloud, Bitbucket Server
  </Card>
</CardGroup>

For complete platform details, see [Supported Git Platforms](/platforms/).

### Integrate with issue trackers

CodeRabbit connects with issue management platforms to create tickets during reviews or discuss code directly in issue comments:

* GitHub Issues
* GitLab Issues
* Jira
* Linear

Learn more about [Issue Creation](/guides/issue-creation).

## IDE extensions

The free CodeRabbit VSCode extension brings core review features to VSCode, Cursor, Windsurf, and compatible editors. Review and polish changes locally before creating PRs.

<Info>
  **Local reviews**: Catch issues before they reach your team's review queue.
  The extension uses the same context-aware analysis as our PR reviews.
</Info>

See [Review local changes](/code-editors) for setup details.

## CodeRabbit CLI

The [CodeRabbit CLI](https://www.coderabbit.ai/cli) seamlessly integrates CodeRabbit's context-aware reviews with your AI coding agent workflow. CodeRabbit CLI hands off both the recommended code changes and deep context it generates to your AI agent via a prompt. Maintain your flow state with reviews that seamlessly integrate with your CLI coding agent, letting it know what code change to make, with context, all in natural language.

<Info>
  **Agent integration**: Keep your development momentum by having CodeRabbit's
  review insights flow directly into your AI coding agent's context.
</Info>

## Data privacy and security

CodeRabbit protects your code through ephemeral processing:

* All LLM queries exist in-memory only, with zero retention after completion
* We don't use your code or reviews to train language models
* No customer data is shared with third parties
* All data remains confidential and isolated by organization
* SOC 2 and GDPR compliant data practices

Learn more at [CodeRabbit Trust Center](https://trust.coderabbit.ai).

## Flexible pricing

<CardGroup cols={2}>
  <Card title="Public repositories" icon="lock-open">
    **Free Pro tier features** for open source projects. Help improve code
    quality across the developer community.
  </Card>

  <Card title="Private repositories" icon="lock">
    **Multiple tiers available** from Free (unlimited summaries) to Enterprise
    (advanced features + SLA support).
  </Card>
</CardGroup>

See complete details at [Pricing](https://www.coderabbit.ai/pricing).

<Note>
  CodeRabbit Enterprise offers self-hosted deployment for teams with 500+ users.
  Contact [CodeRabbit Sales](mailto:sales@coderabbit.ai) for enterprise options.
</Note>

## What's next

<CardGroup cols={3}>
  <Card title="Quickstart" icon="rocket" href="/getting-started/quickstart/">
    Experience your first CodeRabbit review in under 5 minutes.
  </Card>

  <Card title="IDE Extension" icon="code" href="/code-editors">
    Install the extension to review local changes before pushing.
  </Card>

  <Card title="CLI" icon="terminal" href="https://www.coderabbit.ai/cli">
    Integrate CodeRabbit reviews directly with your AI coding agent.
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Quickstart

> This tutorial gives you a hands-on demonstration of CodeRabbit, using a real GitHub repository. It guides you through the following tasks:

<Steps>
  <Step title="Integrate CodeRabbit into a GitHub repository that you own" />

  <Step title="Observe CodeRabbit perform a code review of a pull request that you initiate" />

  <Step title="Converse with CodeRabbit about the code review" />

  <Step title="Prompt CodeRabbit to generate its own improvements to the pull request" />
</Steps>

When you complete this tutorial, you'll have seen CodeRabbit's code-review feature in action, and glimpsed a few of its other AI-driven abilities as well.

For a more general overview of CodeRabbit, see [Introduction](/).

<Note>
  While this tutorial focuses on GitHub, CodeRabbit also works with GitLab,
  Azure DevOps, and Bitbucket. For more information, see [Integrate with Git
  platforms](/platforms/).
</Note>

## Before you begin

Create a new, private repository on GitHub. Name the new repository `coderabbit-test`, and let it have otherwise default GitHub settings.

## Integrate CodeRabbit with your GitHub account

To integrate CodeRabbit with your GitHub account, follow these steps:

<Steps>
  <Step title="Create an account">
    Visit [the CodeRabbit login
    page](https://app.coderabbit.ai/login?free-trial).
  </Step>
</Steps>

CodeRabbit takes a moment to set up the integration. After it finishes, the CodeRabbit dashboard appears.

## Add CodeRabbit to your repository

To add CodeRabbit to your test repository, follow these steps:

<Steps>
  <Step title="Access repository settings">
    On the CodeRabbit dashboard, click **Add Repositories**. A GitHub repository-access dialog appears.
  </Step>

  <Step title="Grant repository access">
    Select the **Only select repositories** radio button.
  </Step>

  <Step title="Select your test repository">
    From the **Select repositories** menu, select the `coderabbit-test` repository that you created earlier in this Quickstart.
  </Step>

  <Step title="Install and authorize CodeRabbit">
    Click **Install & Authorize**.

    <Note>
      CodeRabbit requests read and write access to your repository in order for its code review, issue management, and pull request generation features to work. CodeRabbit never stores your code. For more information, see [the
      CodeRabbit Trust Center](https://trust.coderabbit.ai).
    </Note>
  </Step>

  <Step title="Complete signup if prompted">
    If a CodeRabbit **Complete your signup** dialog appears, then fill it out with the requested information before continuing.
  </Step>
</Steps>

CodeRabbit is now ready to use with your test repository. The next steps demonstrate its core code-review features.

## Let CodeRabbit perform a code review

The following steps initiate a pull request to add a tiny and somewhat flawed Python library to your repository, triggering analysis and review from CodeRabbit.

Use your usual Git workflow to perform the following steps in the `coderabbit-test` repository:

<Steps>
  <Step title="Create a branch">
    Create a branch named `add-utils`.
  </Step>

  <Step title="Create a new file">
    In that new `add-utils` branch, create a new file called `simple_utils.py`, with the following content:

    ```python  theme={null}
    # simple_utils.py - A tiny utility library

    def reverse_string(text):
        """Reverses the characters in a string."""
        return text[::-1]

    def count_words(sentence):
        return len(sentence.split())

    def celsius_to_fahrenheit(celsius):
        return (celsius * 9/5) + 32
    ```
  </Step>

  <Step title="Commit the file">
    Commit the added file to the `add-utils` branch. Use any text you want for the commit message.
  </Step>

  <Step title="Create a pull request">
    Create a pull request that proposes to merge the `add-utils` branch into the `main` branch. Use any text you want for the pull request message.
  </Step>
</Steps>

After a few moments, CodeRabbit responds to the pull request using the `@coderabbitai` GitHub account. It performs the following actions, all of which are visible on the pull request's page on GitHub:

* If you didn't write a pull request summary, then CodeRabbit adds a new summary to the pull request.
* CodeRabbit posts a comment titled **Walkthrough** containing analysis and commentary about the content of the pull request.
* CodeRabbit attaches a detailed code review to the pull request as another comment.

Part of the review resembles the following screenshot:

<img src="https://mintcdn.com/coderabbit/D_rqUjBaYiE185JH/images/getting-started/assets/images/quickstart-comment-9310a2af173d5afbd2c74a762e6bd808.png?fit=max&auto=format&n=D_rqUjBaYiE185JH&q=85&s=159b85cdd77b56e33b809b0d3d4cb7cb" alt="An example code review comment" data-og-width="1624" width="1624" data-og-height="964" height="964" data-path="images/getting-started/assets/images/quickstart-comment-9310a2af173d5afbd2c74a762e6bd808.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/coderabbit/D_rqUjBaYiE185JH/images/getting-started/assets/images/quickstart-comment-9310a2af173d5afbd2c74a762e6bd808.png?w=280&fit=max&auto=format&n=D_rqUjBaYiE185JH&q=85&s=49572f912d1556c1e2100c8b261a672a 280w, https://mintcdn.com/coderabbit/D_rqUjBaYiE185JH/images/getting-started/assets/images/quickstart-comment-9310a2af173d5afbd2c74a762e6bd808.png?w=560&fit=max&auto=format&n=D_rqUjBaYiE185JH&q=85&s=db43f41c858bb4c35be61c3e9817bcfe 560w, https://mintcdn.com/coderabbit/D_rqUjBaYiE185JH/images/getting-started/assets/images/quickstart-comment-9310a2af173d5afbd2c74a762e6bd808.png?w=840&fit=max&auto=format&n=D_rqUjBaYiE185JH&q=85&s=fcf1ba9035aefc14e7fbe2dc53f2d7b5 840w, https://mintcdn.com/coderabbit/D_rqUjBaYiE185JH/images/getting-started/assets/images/quickstart-comment-9310a2af173d5afbd2c74a762e6bd808.png?w=1100&fit=max&auto=format&n=D_rqUjBaYiE185JH&q=85&s=2719c7e5252c0e2deb556ff648ec7b61 1100w, https://mintcdn.com/coderabbit/D_rqUjBaYiE185JH/images/getting-started/assets/images/quickstart-comment-9310a2af173d5afbd2c74a762e6bd808.png?w=1650&fit=max&auto=format&n=D_rqUjBaYiE185JH&q=85&s=0e5be4b0cc953c8b3f2c88a265be438e 1650w, https://mintcdn.com/coderabbit/D_rqUjBaYiE185JH/images/getting-started/assets/images/quickstart-comment-9310a2af173d5afbd2c74a762e6bd808.png?w=2500&fit=max&auto=format&n=D_rqUjBaYiE185JH&q=85&s=dfd73185019b0c8130d3a2fe87b50d47 2500w" />

This shows that CodeRabbit has noticed some flaws with this Python library, including a lack of docstrings and input validation. The review comment identifies these flaws, and suggests how you might improve them.

## Ask CodeRabbit for more information

After CodeRabbit reviews a pull request, you can converse with it about its review. You can also give CodeRabbit special commands to request it to perform specific functions, such as generating appropriate code changes for you.

1. Post the following as a new GitHub comment attached to the pull request:

   ```text Chat in PR wrap theme={null}
   @coderabbitai Why do all of these functions need docstrings? Isn't it obvious enough what they do?
   ```

   After a few moments, CodeRabbit posts its reply, explaining its motivations for its recommendation. The reply might resemble the following:

   > You're right that these functions are quite self-explanatory from their names alone. Docstrings aren't strictly necessary for every function, especially in smaller projects with clear function names.
   >
   > While docstrings do provide benefits (IDE tooltips, documentation generation, help for future developers), they can sometimes feel redundant for very straightforward functions. It's ultimately a matter of coding style and project requirements.
   >
   > If you prefer to skip docstrings for obvious utility functions in this project, that's perfectly reasonable. Would you like me to adjust my review approach regarding documentation for this repository?

   In this case, CodeRabbit is offering to adjust its future behavior when reviewing changes to this repository. Instead, follow the next step to ask CodeRabbit to implement part of its suggestions.

2. Post the following as another new comment:

   ```text  theme={null}
   @coderabbitai generate docstrings
   ```

   After a few moments, CodeRabbit does the following:

   * CodeRabbit creates a new branch, based on `add-utils`.
   * CodeRabbit commits changes to the branch that adds suggested docstrings to `add-utils`.
   * CodeRabbit opens a new pull request between the new branch and `add-utils`.

## Clean up

Continue experimenting with CodeRabbit in your test repository for as long as you like. When you're finished, you can delete the repository.

You are now ready to add CodeRabbit to other repositories that you own, and let it review some real pull requests.

## What's next

* [Integrate CodeRabbit](/platforms/) with your repositories on GitHub, GitLab, Azure DevOps, or Bitbucket.
* [Configure CodeRabbit](/getting-started/yaml-configuration) beyond its default settings.
* [Add custom review instructions](/guides/review-instructions).
* [Get support for CodeRabbit](/getting-started/support).


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Overview

> Connect CodeRabbit with your preferred Git platform including GitHub, GitLab, Azure DevOps, and Bitbucket for AI-powered code reviews right in your PR.

CodeRabbit seamlessly integrates with all major Git platforms to bring AI-powered code reviews directly to your development workflow. Choose your platform below to get started with step-by-step integration guides.

## Supported Git platforms

<CardGroup cols={2}>
  <Card title="GitHub.com" icon="github" href="/platforms/github-com">
    Connect your GitHub.com repositories for instant AI code reviews
  </Card>

  <Card title="GitHub Enterprise Server" icon="github" href="/platforms/github-enterprise-server">
    Self-hosted GitHub integration for enterprise teams
  </Card>

  <Card title="GitLab.com" icon="gitlab" href="/platforms/gitlab-com">
    Integrate with GitLab.com for comprehensive code analysis
  </Card>

  <Card title="Self-managed GitLab" icon="gitlab" href="/platforms/self-hosted-gitlab">
    Connect your on-premises GitLab instance
  </Card>

  <Card title="Azure DevOps" icon="microsoft" href="/platforms/azure-devops">
    Seamless integration with Microsoft Azure DevOps
  </Card>

  <Card title="Bitbucket Cloud" icon="bitbucket" href="/platforms/bitbucket-cloud">
    AI code reviews for your Bitbucket Cloud repositories
  </Card>
</CardGroup>

<Info>
  **Need enterprise-grade deployment?** CodeRabbit offers a self-hosted option
  for Enterprise customers with 500+ user seats. [Contact our sales
  team](https://www.coderabbit.ai/contact-us/sales) to learn more about
  CodeRabbit Enterprise.
</Info>

## Integration process

While each Git platform has specific setup requirements, the general integration process follows these steps:

<Steps>
  <Step title="Authenticate with your Git platform">
    Log into CodeRabbit using your Git platform account credentials for secure,
    streamlined access.
  </Step>

  <Step title="Add your organizations">
    Connect the organizations containing repositories you want CodeRabbit to
    review. You'll need ownership-level permissions for these organizations.

    <Note>
      Different platforms use different terminology: "organizations" on GitHub,
      "groups" on GitLab, and "workspaces" on Bitbucket.
    </Note>
  </Step>

  <Step title="Configure service account">
    Create a dedicated CodeRabbit service account if required. Some platforms
    like GitHub.com handle this automatically.
  </Step>

  <Step title="Grant repository permissions">
    Authorize CodeRabbit to access the specific repositories where you want AI
    code reviews enabled.
  </Step>
</Steps>

Once integration is complete, CodeRabbit immediately begins [reviewing pull requests](/guides/code-review-overview) with its default configuration. You can then [customize the configuration](/guides/configuration-overview) to match your team's specific needs and coding standards.


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# GitHub

> Learn how to integrate CodeRabbit with GitHub.com repositories for automated AI-powered code reviews, including setup, permissions, and repository configuration.

<Info>
  For an overview of how CodeRabbit integrates with Git platforms, see [Add CodeRabbit to your repository](/platforms).

  For a hands-on tutorial with CodeRabbit performing code reviews on a live GitHub repository that you create, see [Quickstart](/getting-started/quickstart).
</Info>

## Prerequisites

<Warning>
  **Required permissions**

  You need to have a GitHub account with **owner-level permissions** for at least one repository associated with that account.

  If you want to authorize CodeRabbit for repositories in a GitHub organization, you need **organization owner permissions** as well.
</Warning>

## Authorize CodeRabbit with your GitHub account

<Steps>
  <Step title="Visit CodeRabbit login page">
    Navigate to [the CodeRabbit login page](https://app.coderabbit.ai/login).
  </Step>

  <Step title="Initiate GitHub login">
    Click **Login with GitHub**. Your browser will redirect to GitHub.com.
  </Step>

  <Step title="Sign in to GitHub (if required)">
    If GitHub prompts you to sign in, enter your GitHub login credentials as you normally would.
  </Step>

  <Step title="Review and authorize permissions">
    GitHub displays a summary of the information that CodeRabbit needs to integrate with your account. This includes read-only access to:

    * Organizations and teams associated with your GitHub account
    * Email addresses associated with your GitHub account

    Click **Authorize coderabbitai** to grant these permissions.
  </Step>

  <Step title="Select an organization">
    Choose the organization where you want to install CodeRabbit.

    * If you belong to multiple organizations, select from the list
    * For personal repositories, select your account name

    <Tip>
      If your organization doesn't appear in the list, see [Adding organizations](/getting-started/adding-organizations).
    </Tip>
  </Step>

  <Step title="Install and authorize CodeRabbit">
    Configure repository access and review the permissions CodeRabbit needs.

    ### Choose repository access

    Select which repositories CodeRabbit can access:

    **All repositories**: Grants access to all current and future repositories owned by this organization, including public repositories.

    **Only select repositories**: Limits access to specific repositories you choose from the list.

    <Tip>
      You can change this setting later if needed.
    </Tip>

    ### Review permissions

    CodeRabbit requires the following permissions to perform code reviews and manage pull requests:

    **Read-only access:**

    * Actions, checks, discussions, members, and metadata

    **Read-and-write access:**

    * Code, commit statuses, issues, and pull requests

    <Note>
      CodeRabbit requests read and write access to your repository for its code review, issue management, and pull request generation features to work. **CodeRabbit never stores your code.** For more information, see [the CodeRabbit Trust Center](https://trust.coderabbit.ai).
    </Note>

    ### Complete installation

    Click **Install & Authorize** (for new integrations) or **Save** (for existing integrations).
  </Step>

  <Step title="Trigger your first review (optional)">
    After installation, you can immediately see CodeRabbit in action or skip to configure settings first.

    **Option 1: Trigger a review**

    1. Select a repository from your list
    2. Choose an existing pull request
    3. CodeRabbit will perform a code review on that pull request

    **Option 2: Skip to dashboard**

    Click **Skip to App** to access the CodeRabbit dashboard and configure settings before your first review.
  </Step>
</Steps>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Overview

> Discover how CodeRabbit transforms your development workflow with AI-powered code reviews that provide instant, comprehensive feedback on every pull request.

Transform your code review process with CodeRabbit's AI-powered analysis that delivers comprehensive feedback within minutes of creating a pull request. Get detailed summaries, security insights, and improvement suggestions that help your team ship better code faster.

<Note>
  Ready to see CodeRabbit in action? Try our [Quickstart
  guide](/getting-started/quickstart) for a hands-on demonstration using a real
  repository.
</Note>

## What CodeRabbit does for your pull requests

CodeRabbit automatically analyzes every pull request with a multi-layered approach that combines the best of AI and industry-standard tools:

<CardGroup cols={2}>
  <Card title="AI-generated summaries" icon="file-text">
    Comprehensive summaries and walkthroughs of code changes with contextual
    insights
  </Card>

  <Card title="Security & quality analysis" icon="shield-check">
    Integration with 40+ open-source linters and security scanners for
    comprehensive coverage
  </Card>

  <Card title="Intelligent suggestions" icon="lightbulb">
    Context-aware improvement recommendations based on your entire repository
  </Card>

  <Card title="Code graph analysis" icon="git-branch">
    Deep understanding of code relationships and dependencies across your
    project
  </Card>
</CardGroup>

## How automatic reviews work

<Steps>
  <Step title="Integration setup">
    After you [connect CodeRabbit to your repository](/platforms), it monitors
    for new pull requests and commits
  </Step>

  <Step title="Instant analysis">
    When a pull request is created, CodeRabbit immediately begins analyzing the
    code changes using multiple AI models and static analysis tools
  </Step>

  <Step title="Comprehensive review">
    Within minutes, CodeRabbit publishes detailed review comments with
    summaries, security findings, and improvement suggestions
  </Step>

  <Step title="Continuous updates">
    For subsequent commits, CodeRabbit performs incremental reviews focusing on
    the new changes
  </Step>
</Steps>

## Review types and severity levels

CodeRabbit categorizes its feedback into different types and severity levels to help you prioritize and address issues effectively.

### Review types

CodeRabbit provides three types of review feedback:

* ⚠️ **Potential issue** - Identifies potential bugs, security vulnerabilities, or problematic code patterns
* 🛠️ **Refactor suggestion** - Recommends code improvements for maintainability, performance, or best practices
* 🧹 **Nitpick** - Suggests minor style or formatting improvements (only in Assertive mode)

### Severity levels

Each review comment is assigned a severity level to indicate its importance:

* 🔴 **Critical** - Severe issues that could cause system failures, security breaches, or data loss
* 🟠 **Major** - Significant problems that impact functionality or performance
* 🟡 **Minor** - Issues that should be addressed but don't critically impact the system
* 🔵 **Trivial** - Low-impact suggestions for code quality improvements
* ⚪ **Info** - Informational comments or context without requiring action

### Review triggers and events

CodeRabbit automatically initiates reviews based on these repository activities:

<Tabs>
  <Tab title="New pull requests" icon="git-pull-request">
    **Full comprehensive review** when a new pull request is created - Complete
    analysis of all proposed changes - Security and quality assessment - Code
    style and best practices review
  </Tab>

  <Tab title="New commits" icon="git-commit">
    **Incremental review** when existing pull requests receive new commits -
    Focus on newly added changes - Updates to previous recommendations -
    Maintains conversation context
  </Tab>
</Tabs>

## Interactive code reviews with CodeRabbit

Once CodeRabbit reviews your pull request, you can engage in dynamic conversations and request specific actions by mentioning `@coderabbitai` in your comments.

<CardGroup cols={3}>
  <Card title="Control reviews" icon="settings" href="/guides/commands">
    Pause, resume, or customize review behavior with simple commands
  </Card>
</CardGroup>

### Smart conversation capabilities

<Tabs>
  <Tab title="Contextual chat" icon="message-circle">
    Ask CodeRabbit questions about your code changes, architecture decisions, or implementation approaches. It has access to your entire repository for informed responses.

    ```md  theme={null}
    @coderabbitai Why did you suggest using a factory pattern here?
    ```
  </Tab>

  <Tab title="Review control" icon="pause-circle">
    Manage CodeRabbit's review behavior for specific pull requests:

    ```md  theme={null}
    @coderabbitai pause
    @coderabbitai resume
    @coderabbitai resolve
    ```
  </Tab>

  <Tab title="Code generation" icon="sparkles">
    Request CodeRabbit to generate documentation:

    ```md  theme={null}
    @coderabbitai generate docstrings
    ```
  </Tab>
</Tabs>

<Tip>
  CodeRabbit learns from your feedback and coding patterns to provide
  increasingly relevant suggestions over time.
</Tip>

## Next steps

Ready to dive deeper into CodeRabbit's capabilities? Explore these essential features to maximize your code review experience:

<CardGroup cols={2}>
  <Card title="Review commands" icon="terminal" href="/guides/commands">
    Learn all the commands to control CodeRabbit's behavior during reviews
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Manage code reviews

> Learn how to control and manage CodeRabbit's automatic code reviews with commands. Pause, resume, ignore reviews, request manual reviews, resolve comments, and update pull request summaries using @coderabbitai commands.

You can control CodeRabbit's behavior with a specific pull request by mentioning the username of its bot, `@coderabbitai`, alongside keywords in comments or the pull request description, as specified by the next sections of this page.

For a complete CodeRabbit command reference, see [Code review command reference](/reference/review-commands).

## Control automatic code reviews

By default, CodeRabbit automatically reviews every new pull request created in your repository. It updates its review with comments whenever the pull request has new commits pushed to it.

The following sections show you how to tell CodeRabbit to modify this behavior with a specific pull request, such as pausing reviews, or resolving open comments.

For more information about permanently configuring the behavior of CodeRabbit on your repository, see [Add a configuration file](/getting-started/yaml-configuration).

### Pause and resume automatic code reviews

You can tell CodeRabbit to pause its automatic reviews of a pull request. If you do, then you can still manually request CodeRabbit to review changes using the commands listed on [Code review command reference](/reference/review-commands).

To pause automated reviews of a pull request, post the following comment to the pull request:

```md  theme={null}
@coderabbitai pause
```

To resume automated reviews after pausing them, post the following comment to the pull request:

```md  theme={null}
@coderabbitai resume
```

### Disable automatic code reviews

To disable automatic code reviews for a pull request, add the following line anywhere in the pull request description:

```md  theme={null}
@coderabbitai ignore
```

As long as that text remains in the description, CodeRabbit will not automatically review any commits associated with that pull request. You can still chat with CodeRabbit and issue other commands in the pull request comments.

To enable automatic reviews on that pull request, delete "`@coderabbitai ignore`" from the pull request description. CodeRabbit commences automatic reviews starting with the next commit made to the branch under review.

## Manually request code reviews

You can ask CodeRabbit to perform a code review at any time. This can be useful when you have paused automated code reviews. Manually requested reviews have two types:

* A *full review* disregards any comments that CodeRabbit has already made on this pull request, and generates a complete review of the entire pull request.

* An *incremental review* takes all comments that CodeRabbit has made since its most recent full review into consideration, and generates a review of only the new changes.

To manually request a full review, post the following comment to the pull request:

```md  theme={null}
@coderabbitai full review
```

To manually request an incremental review, post the following comment to the pull request:

```md  theme={null}
@coderabbitai review
```

## Resolve comments

To have CodeRabbit mark all of its previous comments as resolved, post the following comment to the pull request:

```md  theme={null}
@coderabbitai resolve
```

## Update information about the pull request

The commands in this section request CodeRabbit to generate and post updated information about the pull request itself.

### Update the summary text

To have CodeRabbit update the generated summary of the branch’s proposed changes to the pull request’s description, post the following comment:

```md  theme={null}
@coderabbitai summary
```

CodeRabbit updates the summary text to the description under the heading "Summary by CodeRabbit".

### Diagram the pull request history

To have CodeRabbit post a comment that contains a sequence diagram which visualizes the history of the pull request under review, post the following comment:

```md  theme={null}
@coderabbitai generate sequence diagram
```

## Get information about CodeRabbit

The commands in this section request CodeRabbit to display its own configuration or documentation.

### Display current configuration

To have CodeRabbit post a comment listing out its current configuration with your repository, post the following comment to the pull request:

```md  theme={null}
@coderabbitai configuration
```

### Display a quick-reference guide

To have CodeRabbit post a comment to the pull request with a quick-reference guide to its own commands and other features, post the following comment to the pull request:

```md  theme={null}
@coderabbitai help
```


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Agentic Pre-merge checks

> Enforce quality gates and organization's custom requirements before pull requests are merged.

<Info>
  **Requirements:** This feature is avaialble in Preview exclusively as part of
  the Pro plan.
</Info>

<Note>
  Up to 5 Custom Pre-merge checks are currently allowed during the Preview
  period. Pricing for this feature will be announced in a few weeks.
</Note>

Agentic Pre-Merge Checks provide automated validation of pull requests against standard quality metrics and organization specific requirements. Use **Built-in Checks** for common requirements and add your own **Custom Checks** with natural language instructions tailored to your team’s policies. These AI-powered checks can be configured by an Admin user at the organization or repository level, and CodeRabbit automatically validates every pull request against these requirements.

### **Why use Pre-Merge Checks?**

* **Consistent standards:** Enforce naming, documentation, and change-management hygiene across every PR.
* **Safer merges:** Catch breaking API changes, security gaps, or policy violations before they land.
* **Team-specific guardrails:** Encode architectural patterns, compliance rules, or business logic as custom checks.
* **Faster reviews:** Surface blocking issues early in the PR **Walkthrough** so reviewers can act quickly.

## Built-in Checks

CodeRabbit includes four standard checks that address common organizational needs:

<CardGroup cols={2}>
  <Card title="Docstring Coverage" icon="file-code">
    Verify PR docstring coverage against a configurable threshold (80% by
    default)
  </Card>

  <Card title="Pull Request Title" icon="heading">
    Validate PR titles accurately reflect changes made and follow your specified
    requirements
  </Card>

  <Card title="Pull Request Description" icon="file-text">
    Verify descriptions follow the template specified in your Git platform
  </Card>

  <Card title="Issue Assessment" icon="link">
    Verify PRs address linked issues without containing out-of-scope changes
  </Card>
</CardGroup>

## Custom Checks

Define your own validation logic using natural language instructions. Custom checks leverage AI to understand and validate complex requirements that go beyond standard code quality metrics.

### **How Custom Checks Work (scope & verification)**

Custom checks run in a secure, **read-only** environment against your PR. They analyze the diff and context, verify details using tools, then return a clear result with reasoning.

<Steps>
  <Step title="Analyze">
    CodeRabbit interprets your **Instructions** against rich PR context:

    * **Repository & diff:** changed files, code snippets, and relevant git history
    * **PR context:** title/description, linked issues, and review discussion
    * **Static analysis:** pattern and code search (e.g., ast-grep, ripgrep)
  </Step>

  <Step title="Verify">
    To substantiate findings, the check may:

    * **Run sandboxed shell commands** to inspect the repo (e.g., scan for patterns, validate configs)
    * **Consult public documentation** and best practices via web lookups
    * **Call connected MCP tools** to pull context from internal systems (docs, knowledge bases, design tools, trackers).

    > See [**Integrate MCP servers**](/context-enrichment/mcp-server-integrations) for setup and behavior
  </Step>

  <Step title="Decide">
    After analysis and verification, the check emits a result — **Passed**, **Failed**, or **Inconclusive** — with brief reasoning so PR authors know what to fix or why a decision couldn't be reached.
  </Step>
</Steps>

## Configuration

### Enforcement Modes

Each check can be configured with one of three enforcement modes:

* `off`: Check is disabled
* `warning`: Display warnings but don't block merges (default)
* `error`: When paired with Request Changes Workflow, block merges until resolved or manually overrided

  > **Configure:** [**Request Changes Workflow**](/reference/configuration#param-request-changes-workflow)

### UI Configuration

Configure Pre-Merge Checks through the CodeRabbit dashboard:

<Steps>
  <Step title="Navigate to Settings">
    In CodeRabbit, go to **Settings → Review → Pre-Merge Checks** (org or repo scope)
  </Step>

  <Step title="Configure Built-in Checks">
    Update configuration and enforcement modes for **Built-in Checks**
  </Step>

  <Step title="Add Custom Checks">
    Add **Custom Checks**:

    * **Name** (≤ 50 chars, unique within the org)
    * **Instructions** (≤ 1000 chars; natural language)
    * **Mode** (off | warning | error)
  </Step>

  <Step title="Apply Changes">
    Click Apply Changes to save. The new checks are applied to subsequent reviews.
  </Step>
</Steps>

### YAML Configuration

For version-controlled configuration, add checks to your `.coderabbit.yaml` file:

```yaml YAML icon=code wrap theme={null}
reviews:
  pre_merge_checks:
    docstrings:
      mode: "error"
      threshold: 85
    title:
      mode: "warning"
      requirements: "Start with an imperative verb; keep under 50 characters."
    description:
      mode: "error"
    issue_assessment:
      mode: "warning"
    custom_checks:
      - name: "Undocumented Breaking Changes"
        mode: "warning"
        instructions: "Pass/fail criteria: All breaking changes to public APIs, CLI flags, environment variables, configuration keys, database schemas, or HTTP/GraphQL endpoints must be documented in the Breaking Change section of the PR description and in CHANGELOG.md. Exclude purely internal or private changes (e.g., code not exported from package entry points or explicitly marked as internal)."
```

## Results in the Walkthrough

Pre-Merge Check results appear alongside CodeRabbit's analysis in the PR **Walkthrough** with clear visual organization for quick assessment.

<Tabs>
  <Tab title="Display Format">
    Results are organized into two tables:

    <CardGroup cols={2}>
      <Card title="Failed checks" icon="X">
        * Prominently displayed to show errors and warnings requiring attention
      </Card>

      <Card title="Passed checks" icon="check">
        Expandable to review checks that were validated successfully
      </Card>
    </CardGroup>
  </Tab>

  <Tab title="Table Structure">
    Each check displays the following information:

    * **Objective** — the name of the check being evaluated
    * **Status** — one of:
      * **❌ Error** — failed and will block merge when **Request Changes** is enabled
      * **⚠️ Warning** — failed but non-blocking
      * **✅ Passed** — requirements met
      * **❓ Inconclusive** — incomplete instructions or insufficient information to decide
    * **Explanation** — why the check passed or failed
    * **Resolution** — what the author can do to remediate
  </Tab>
</Tabs>

### **Unblocking a PR**

If **Request Changes Workflow** is enabled and a check in **Error** mode fails, the PR is blocked until the issue is resolved or you explicitly ignore it. To ignore, select the **Ignore failed checks** checkbox in the PR Walkthrough. The PR is then unblocked and the affected rows are tagged **\[IGNORED]** for traceability.

<Note>
  The override applies only to that PR. Future PRs will still enforce checks as
  configured.
</Note>

## Manual commands

Trigger pre-merge checks manually using chat commands:

### Run All Checks

```md  theme={null}
@coderabbitai run pre-merge checks
```

This reruns all configured checks and updates results in the walkthrough.

### Test Custom Check

```dotenv icon=text wrap theme={null}
@coderabbitai evaluate custom pre-merge check --name <check_name> --instructions <text> [--mode <error|warning>]
```

Tests custom check logic before saving to configuration.

### **Ignore failures**

```md  theme={null}
@coderabbitai ignore pre-merge checks
```

Manually ignore failed checks and unblock the PR.

> See [**Manage code reviews**](/guides/commands) for more commands and behaviors.

## **Best practices**

* Write custom check instructions that are specific and actionable. Keep instructions concise and testable with one purpose per check.
* Start new checks in warning mode to gather feedback, then move to error mode once the team is aligned on expectations.
* Periodically review check results and inconclusive cases to refine instructions and identify gaps in validation logic.


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Generate docstrings

> Automatically generate comprehensive docstrings that match your existing format, delivered through PR workflow for complete review control

<Info>
  This feature is available exclusively as part of the Pro plan and is not
  included in the Lite plan. Please refer to our [pricing
  page](https://www.coderabbit.ai/pricing) for more information about our plans
  and features.
</Info>

Writing documentation for every function is time-consuming, but undocumented code creates bottlenecks during code reviews. You spend cycles explaining what functions do instead of focusing on business logic and architecture decisions.

CodeRabbit generates docstrings for functions missing documentation in your PRs. Comment `@coderabbitai generate docstrings` or check the box in your PR walkthrough to trigger generation.

The system scans your changes with ast-grep, identifies functions needing documentation, and generates docstrings that match your codebase's existing format. Generated docstrings are committed to a new branch and opened as a PR for your review.

This handles the initial documentation grunt work while keeping you in control through the standard PR review process.

## How it works

<Steps>
  <Step title="Trigger generation">
    Comment `@coderabbitai generate docstrings` in your PR or check **Generate
    Docstrings** in the CodeRabbit Walkthrough
  </Step>

  <Step title="Function analysis">
    ast-grep scans your PR changes to identify functions missing docstrings or
    with incomplete documentation
  </Step>

  <Step title="Format-aware generation">
    AI analyzes your existing docstrings to detect format patterns (JSDoc,
    Google-style, Sphinx) and generates matching documentation
  </Step>

  <Step title="PR workflow">
    Generated docstrings are committed to a new branch with a PR opened against
    your original branch for review and merge (typically 30-60 seconds)
  </Step>
</Steps>

<img src="https://mintcdn.com/coderabbit/D_rqUjBaYiE185JH/images/finishing-touches/assets/images/docstrings-pull-request-9148dc697aa77238c93a4797a87f726a.png?fit=max&auto=format&n=D_rqUjBaYiE185JH&q=85&s=ad01b2354519f17535da0abbb50dcca5" alt="Docstrings PR example showing generated documentation in a pull request" data-og-width="1380" width="1380" data-og-height="810" height="810" data-path="images/finishing-touches/assets/images/docstrings-pull-request-9148dc697aa77238c93a4797a87f726a.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/coderabbit/D_rqUjBaYiE185JH/images/finishing-touches/assets/images/docstrings-pull-request-9148dc697aa77238c93a4797a87f726a.png?w=280&fit=max&auto=format&n=D_rqUjBaYiE185JH&q=85&s=5aede00d15bafe8ba357aad2e84d4f8e 280w, https://mintcdn.com/coderabbit/D_rqUjBaYiE185JH/images/finishing-touches/assets/images/docstrings-pull-request-9148dc697aa77238c93a4797a87f726a.png?w=560&fit=max&auto=format&n=D_rqUjBaYiE185JH&q=85&s=1194e23dec7acef982fdd6e096be4718 560w, https://mintcdn.com/coderabbit/D_rqUjBaYiE185JH/images/finishing-touches/assets/images/docstrings-pull-request-9148dc697aa77238c93a4797a87f726a.png?w=840&fit=max&auto=format&n=D_rqUjBaYiE185JH&q=85&s=4b6a99e9278f7aebd93fb408d456229f 840w, https://mintcdn.com/coderabbit/D_rqUjBaYiE185JH/images/finishing-touches/assets/images/docstrings-pull-request-9148dc697aa77238c93a4797a87f726a.png?w=1100&fit=max&auto=format&n=D_rqUjBaYiE185JH&q=85&s=7884a4e9730ea15eb95b4ada7bee82da 1100w, https://mintcdn.com/coderabbit/D_rqUjBaYiE185JH/images/finishing-touches/assets/images/docstrings-pull-request-9148dc697aa77238c93a4797a87f726a.png?w=1650&fit=max&auto=format&n=D_rqUjBaYiE185JH&q=85&s=8305c9ea89635a9cb5637d1118af0250 1650w, https://mintcdn.com/coderabbit/D_rqUjBaYiE185JH/images/finishing-touches/assets/images/docstrings-pull-request-9148dc697aa77238c93a4797a87f726a.png?w=2500&fit=max&auto=format&n=D_rqUjBaYiE185JH&q=85&s=cc2c5cdff529678b63140b528109e312 2500w" />

You review the generated PR like any other code change. CodeRabbit preserves existing docstrings and only documents functions that genuinely need it.

<Tip>
  CodeRabbit automatically detects your docstring format by analyzing existing
  documentation patterns. It matches JSDoc, Google-style, Sphinx, custom
  formats, or even Go's doc comment conventions without any configuration.
</Tip>

## Platform and integration support

<CardGroup cols={3}>
  <Card title="Full PR workflow" icon="git-branch">
    **Complete integration:**

    * GitHub
    * GitLab
    * Azure DevOps

    *Branch creation, PR opening, full review workflow*
  </Card>

  <Card title="Comment integration" icon="message-circle">
    **Streamlined process:**

    * Bitbucket

    *Docstrings delivered as PR comments while we complete full integration*
  </Card>

  <Card title="Language coverage" icon="code">
    **18+ languages supported:**

    * Python, JavaScript, TypeScript
    * Go, Rust, Java, Kotlin, Swift
    * C, C++, C#, Ruby, PHP, Lua, Elixir, Bash

    *Support depends on ast-grep parsing capabilities*
  </Card>
</CardGroup>

<Warning>
  **Bitbucket integration:** Currently receives docstrings as PR comments rather than separate PRs. Full workflow support is in development.
</Warning>

## Configure per-directory styles

<Accordion title="Customize documentation format using .coderabbit.yaml">
  Different parts of your codebase need different documentation approaches. Use path-based instructions to match your team's standards:

  ```yaml  theme={null}
  code_generation:
    docstrings:
      path_instructions:
        - path: "src/**/*.ts"
          instructions: |
            Use TSDoc format with @param, @returns, and @example tags.
            Include code examples for public API functions.
            Focus on behavior and edge cases.
        - path: "**/*test*"
          instructions: |
            Describe test purpose and expected behavior.
            Keep docstrings concise - focus on what is being tested.
        - path: "scripts/**/*.py"
          instructions: |
            Use Google-style docstrings with Args and Returns sections.
            Include usage examples for utility scripts.
        - path: "models/**/*.py"
          instructions: |
            Document database models with field descriptions and relationships.
            Include example queries and common usage patterns.
  ```

  Path patterns use [minimatch](https://github.com/isaacs/minimatch) syntax to target specific directories, file types, or naming conventions.

  ### Common configuration examples

  **Frontend components:**

  ```yaml  theme={null}
  - path: "components/**/*.tsx"
    instructions: "Document props, usage examples, and accessibility considerations"
  ```

  **API endpoints:**

  ```yaml  theme={null}
  - path: "api/**/*.{js,ts}"
    instructions: "Document request/response formats, status codes, and error handling"
  ```

  **Utility functions:**

  ```yaml  theme={null}
  - path: "utils/**/*"
    instructions: "Focus on input validation, return types, and edge case behavior"
  ```

  **Database models:**

  ```yaml  theme={null}
  - path: "models/**/*.py"
    instructions: "Document fields, relationships, and include example queries"
  ```
</Accordion>

## Reviewing generated docstrings

When CodeRabbit opens a docstring PR, focus your review on:

**Content accuracy:**

* Parameter descriptions match actual function behavior
* Return value documentation reflects real outputs
* Edge cases and error conditions are correctly described

**Format consistency:**

* Generated format matches your codebase conventions
* Examples use appropriate syntax for your language
* Terminology aligns with your project's vocabulary

**Completeness:**

* All parameters are documented with appropriate detail
* Complex functions include usage examples
* Error conditions and exceptions are covered

Most generated docstrings need minimal adjustment. Common tweaks include refining parameter descriptions or adding project-specific terminology.

## Technical implementation

CodeRabbit uses [ast-grep](https://ast-grep.github.io/) for precise code parsing across different programming languages and coding styles. This enables accurate function detection while respecting your code structure and automatically detecting your preferred docstring format.

Language support depends on ast-grep capabilities. To request additional language support, contribute to the [ast-grep language addition guide](https://ast-grep.github.io/contributing/add-lang.html#add-new-language-to-ast-grep).

**Currently supported:** Bash, C, C++, C#, Elixir, Go, Java, JavaScript, Kotlin, Lua, PHP, Python, React TypeScript, Ruby, Rust, Swift, TypeScript.

## Next steps

Ready to enhance your development workflow? Explore these related features and resources:

<CardGroup cols={2}>
  <Card title="Finishing touches overview" icon="sparkles" href="/finishing-touches">
    Discover all code improvement features available in the finishing touches
    suite
  </Card>

  <Card title="Configure CodeRabbit" icon="settings" href="/getting-started/yaml-configuration">
    Set up .coderabbit.yaml to match your team's documentation standards and
    workflows
  </Card>

  <Card title="Unit test generation" icon="flask" href="/finishing-touches/unit-test-generation">
    Automatically generate comprehensive unit tests for your functions and
    methods
  </Card>

  <Card title="Join our community" icon="users" href="https://discord.com/channels/1134356397673414807/1317286905557287022">
    Connect with other developers and share feedback in our Discord community
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Generate unit tests

> Generate comprehensive unit tests automatically for your pull requests, including edge cases and error conditions.

<Info>
  This feature is available exclusively as part of the Pro plan and is not
  included in the Lite plan. Please refer to our [pricing
  page](https://www.coderabbit.ai/pricing) for more information about our plans
  and features.
</Info>

<Warning>This feature is in beta.</Warning>

## Platform support

<CardGroup cols={2}>
  <Card title="Version control" icon="git-branch">
    GitHub (GitLab and Bitbucket coming soon)
  </Card>

  <Card title="CI/CD integration" icon="gear">
    GitHub Actions (automatic build failure resolution)
  </Card>
</CardGroup>

<img src="https://mintcdn.com/coderabbit/D_rqUjBaYiE185JH/images/finishing-touches/assets/images/utg.gif?s=fc4df621b719a224133ebd133c3a4384" alt="Unit Test Generation" data-og-width="1920" width="1920" data-og-height="1080" height="1080" data-path="images/finishing-touches/assets/images/utg.gif" data-optimize="true" data-opv="3" />

AI coding tools let you write code 10x faster, but comprehensive testing still happens manually. CodeRabbit bridges this gap by analyzing your code changes and generating sophisticated unit tests that understand your project's patterns, testing frameworks, and edge cases.

<CardGroup cols={2}>
  <Card title="PR comment command" icon="message-square-code">
    Type `@coderabbitai generate unit tests` in any PR comment to generate tests
    automatically
  </Card>

  <Card title="UI checkbox" icon="square-check-big">
    Use the **Generate unit tests** checkbox in the CodeRabbit Walkthrough for
    one-click generation
  </Card>
</CardGroup>

## How it works

<Steps>
  <Step title="Request test generation">
    Comment `@coderabbitai generate unit tests` in your PR or check the box in
    CodeRabbit Walkthrough
  </Step>

  <Step title="Context-aware analysis">
    CodeRabbit examines your code changes with full context - understanding your
    testing frameworks, existing patterns, and team guidelines from previous
    reviews to identify what needs coverage
  </Step>

  <Step title="Intelligent test generation">
    Tests are generated based on your project's specific context, including
    proper mocking strategies, framework conventions, and edge cases that matter
    for your codebase
  </Step>

  <Step title="Choose delivery method">
    Receive tests via separate PR, new commit in current PR, or comment to
    copy-paste
  </Step>

  <Step title="Automatic CI integration">
    For separate PRs, CodeRabbit analyzes your GitHub Actions workflows and
    fixes build failures, import errors, and dependency issues automatically
  </Step>
</Steps>

CodeRabbit's test generation goes beyond basic templates. It understands your project's testing patterns and generates tests that actually integrate with your existing test suite.

## Output delivery options

<Tabs>
  <Tab title="Separate PR">
    **Recommended for most teams** CodeRabbit creates a new pull request
    containing all generated tests. This approach keeps your feature PR focused
    while allowing independent review of test code. **Key advantage**:
    CodeRabbit automatically fixes CI/CD integration issues. If tests fail due
    to missing dependencies, import errors, or configuration problems,
    CodeRabbit analyzes your GitHub Actions logs and pushes fixes. This means
    you get working tests, not just test code that looks right.
  </Tab>

  <Tab title="Same PR commit">
    Tests are added as a new commit to your existing pull request. This keeps
    feature code and tests together but expands your PR scope. Good for smaller
    changes where you want everything reviewed together.
  </Tab>

  <Tab title="Comment">
    Tests are provided in a PR comment for manual copy-paste. This gives you
    complete control over when and how to add the tests to your codebase. Useful
    when you want to review generated tests before committing or when working
    with restricted repository permissions.
  </Tab>
</Tabs>

## Path-specific customization

Configure test generation for different parts of your codebase using `.coderabbit.yaml`:

```yaml  theme={null}
code_generation:
  unit_tests:
    path_instructions:
      - path: "**/*.ts"
        instructions: |
          Use vitest for testing framework.
          Generate comprehensive test cases including edge cases and error conditions.
          Include proper TypeScript types in test expectations.
      - path: "**/api/**"
        instructions: |
          Focus on request/response validation and error handling.
          Mock external API calls using MSW.
          Test authentication middleware and rate limiting.
      - path: "**/components/**"
        instructions: |
          Use React Testing Library for component tests.
          Test user interactions, accessibility, and error boundaries.
          Mock complex props and verify state changes.
```

These instructions become part of CodeRabbit's context for future test generation, continuously improving test quality and consistency across your codebase.

Unit test generation is part of CodeRabbit's finishing touches - adding the comprehensive test coverage that ensures code quality and maintainability.


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Overview

The CodeRabbit Dashboard provides visibility into your team's review speed, code quality, collaboration patterns, and the impact of AI-assisted reviews. Use the dashboard to track performance, identify bottlenecks, and measure the ROI of CodeRabbit across your organization.

<Note>
  All metrics are calculated only for **merged pull requests** within the
  selected timeframe.
</Note>

## Filters

All dashboard metrics can be filtered by:

* **Timeframe**: Select a date range for analysis
* **Repository**: Focus on specific repositories
* **Username**: View individual contributor metrics
* **Team**: Analyze team-level performance

## Dashboard tabs

The dashboard is organized into five tabs, each designed for different analytical needs.

### Summary

The Summary tab provides a high-level overview of team performance in terms of delivery speed and review quality. It displays throughput metrics, time saved through AI-assisted reviews, comment volume and acceptance rates, and issues surfaced by automated tools.

For detailed metric definitions, see [Summary metrics](/guides/dashboard-metrics#summary).

**Key questions this tab answers:**

* How much productivity is the team gaining from AI-assisted reviews?
* Is AI-generated feedback trustworthy and relevant?
* What types of review comments appear most frequently?

<Tip>
  If **Median Time to Last Commit** spikes, it may signal bottlenecks or
  overloaded reviewers.
</Tip>

### Quality Metrics

The Quality Metrics tab shows what kinds of issues CodeRabbit flags, how often developers agree with the feedback, and where the largest opportunities for code quality improvements exist.

For detailed metric definitions, see [Quality metrics](/guides/dashboard-metrics#quality-metrics).

**Key questions this tab answers:**

* Are we improving code quality across critical domains?
* Is CodeRabbit catching meaningful issues?
* Do developers trust and act on AI suggestions?
* Are certain teams or repositories seeing more severe problems?

<Tip>
  High acceptance for critical issues suggests CodeRabbit is catching
  **meaningful defects** early.
</Tip>

### Time Metrics

A fast review cycle keeps engineering teams unblocked and deployments predictable. The Time Metrics tab highlights how quickly work moves through your review process.

For detailed metric definitions, see [Time metrics](/guides/dashboard-metrics#time-metrics).

**Key questions this tab answers:**

* Is our review process fast enough to support development velocity?
* Where do PRs wait the longest—before, during, or after reviews?
* Are certain repositories or teams experiencing delays unrelated to reviews?

<Tip>
  If **Time to Last Commit** is short but **Time to Merge** is much longer, PRs
  may be sitting idle—stalled by approvals, release gates, or unclear ownership.
</Tip>

### Org Trends

The Org Trends tab visualizes how your team's activity and collaboration patterns evolve over time, helping you identify trends in throughput, review participation, and CI/CD health.

For detailed metric definitions, see [Org Trends metrics](/guides/dashboard-metrics#org-trends).

**Key questions this tab answers:**

* Are we merging work consistently, or is a backlog forming?
* Is review participation evenly distributed across the team?
* Are weekly activity levels trending in a healthy direction?

<Tip>
  Slow **Time to First Human Review** combined with concentrated reviewer
  activity may indicate review responsibilities are falling on too few people.
</Tip>

### Data Metrics

Data Metrics tab lets you drill down to individual pull requests and users. It's designed for auditability, coaching insights, and debugging review process issues.

For detailed metric definitions, see [Data metrics](/guides/dashboard-metrics#data-metrics).

**Key questions this tab answers:**

* Which developers need more support?
* Which PRs took unusually long to finalize, and why?
* Are certain contributors struggling with specific issue types?
* Which tools surface the most issues?

## What's next

* [Dashboard metrics reference](/guides/dashboard-metrics) — Detailed definitions and calculations for all metrics


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Dashboard Metrics

> Detailed definitions and calculations for all CodeRabbit dashboard metrics.

<Note>
  All metrics are calculated only for **merged pull requests** within the
  selected timeframe. Metrics can be filtered by repository, username, or team.
</Note>

## Summary

**Merged Pull Requests**: Total pull requests successfully merged.

**Active Users**: Distinct users whose pull requests were reviewed by CodeRabbit.

**Median Time to Last Commit**: Median time from review readiness to last commit.

<Expandable title="Calculation details">
  Median of `(last_commit - ready_for_review)` where:

  * `ready_for_review`: Timestamp when PR was marked ready for review (or creation date if never in draft)
  * `last_commit`: Timestamp of the last non-merge, non-rebased commit (or merge date if no new commits)
</Expandable>

**Reviewer Time Saved**: AI-estimated human reviewer time saved during pull request reviews.

<Expandable title="Calculation details">
  Sum of estimated review effort displayed in the Walkthrough section of each
  merged PR, representing the human review time saved since CodeRabbit's
  automated analysis handles the initial code review.
</Expandable>

**CodeRabbit Review Comments**: Review comments posted by CodeRabbit on merged PRs.

**Acceptance Rate**: Percentage of CodeRabbit comments accepted by developers.

**Avg Review Comments Posted per PR**: Average review comments per pull request from CodeRabbit and human reviewers.

**Review Comments by Severity**: Distribution of CodeRabbit review comments grouped by severity.

**Severity Distribution**: Radar view of CodeRabbit comments by severity, showing posted vs accepted.

**Review Comments by Category**: Distribution of CodeRabbit review comments grouped by category.

<Expandable title="Additional details">
  Categories describe the type of issue identified:

  * **Security & Privacy**: Vulnerabilities that enable exploitation or expose sensitive data (e.g., auth bypass, injection attacks, exposed secrets)
  * **Data Integrity & Integration**: Problems that corrupt data or break API/schema contracts (e.g., transaction issues, schema mismatches, broken migrations)
  * **Performance & Scalability**: Inefficiencies impacting speed or resource usage (e.g., N+1 queries, missing caching, unoptimized loops)
  * **Stability & Availability**: Issues causing crashes, hangs, or resource leaks at runtime (e.g., null pointer errors, memory leaks, deadlocks)
  * **Functional Correctness**: Logic errors producing wrong results (e.g., off-by-one errors, incorrect conditions, algorithm mistakes)
  * **Maintainability & Code Quality**: Code hygiene affecting readability and future changes (e.g., unclear naming, duplication, poor structure)

  Data captured from Nov 10, 2025 onwards.
</Expandable>

**Category Distribution**: Radar view of CodeRabbit comments by category, showing posted vs accepted.

<Expandable title="Additional details">
  Categories describe the type of issue identified:

  * **Security & Privacy**: Vulnerabilities that enable exploitation or expose sensitive data (e.g., auth bypass, injection attacks, exposed secrets)
  * **Data Integrity & Integration**: Problems that corrupt data or break API/schema contracts (e.g., transaction issues, schema mismatches, broken migrations)
  * **Performance & Scalability**: Inefficiencies impacting speed or resource usage (e.g., N+1 queries, missing caching, unoptimized loops)
  * **Stability & Availability**: Issues causing crashes, hangs, or resource leaks at runtime (e.g., null pointer errors, memory leaks, deadlocks)
  * **Functional Correctness**: Logic errors producing wrong results (e.g., off-by-one errors, incorrect conditions, algorithm mistakes)
  * **Maintainability & Code Quality**: Code hygiene affecting readability and future changes (e.g., unclear naming, duplication, poor structure)

  Data captured from Nov 10, 2025 onwards.
</Expandable>

**Avg Review Iterations per PR**: Average number of review iterations per pull request.

<Expandable title="Calculation details">
  Count of review events per PR.
</Expandable>

**Tool Findings**: Automated tool findings surfaced during reviews.

<Expandable title="Tool categories">
  * **SAST**: Security scanners like Semgrep, Gitleaks, Checkov
  * **Linter**: Code quality tools like ESLint, RuboCop, Flake8
  * **Other**: Unrecognized tools
</Expandable>

**Pipeline Failures**: CI/CD pipeline failures detected during reviews.

***

## Quality Metrics

**Acceptance Rate by Severity**: Percentage of CodeRabbit comments accepted, grouped by severity.

<Expandable title="Calculation details">
  `(Accepted comments ÷ Posted comments) × 100` calculated per severity level.
</Expandable>

**Review Comment Count by Severity**: Number of CodeRabbit comments posted and accepted, grouped by severity.

**Acceptance Rate by Category**: Percentage of CodeRabbit comments accepted, grouped by category.

<Expandable title="Calculation details">
  `(Accepted comments ÷ Posted comments) × 100` calculated per category.

  Data captured from Nov 10, 2025 onwards.
</Expandable>

**Review Comment Count by Category**: Number of CodeRabbit comments posted and accepted, grouped by category.

<Expandable title="Additional details">
  Data captured from Nov 10, 2025 onwards.
</Expandable>

**Tool Findings by Tool Name**: Automated tool findings grouped by individual tool.

**Tool Findings by Severity**: Automated tool findings grouped by severity.

### Comment categories

Categories describe the type of issue identified:

* **Security & Privacy**: Vulnerabilities that enable exploitation or expose sensitive data (e.g., auth bypass, injection attacks, exposed secrets)
* **Data Integrity & Integration**: Problems that corrupt data or break API/schema contracts (e.g., transaction issues, schema mismatches, broken migrations)
* **Performance & Scalability**: Inefficiencies impacting speed or resource usage (e.g., N+1 queries, missing caching, unoptimized loops)
* **Stability & Availability**: Issues causing crashes, hangs, or resource leaks at runtime (e.g., null pointer errors, memory leaks, deadlocks)
* **Functional Correctness**: Logic errors producing wrong results (e.g., off-by-one errors, incorrect conditions, algorithm mistakes)
* **Maintainability & Code Quality**: Code hygiene affecting readability and future changes (e.g., unclear naming, duplication, poor structure)

***

## Time Metrics

**Time to Merge**: Duration from PR review-ready to merge. Shown as average, median, P75, and P90.

<Expandable title="Calculation details">
  `(pr_merge - ready_for_review)` where:

  * `ready_for_review`: Timestamp when PR was marked ready for review (or creation date if never in draft)
  * `pr_merge`: Timestamp when the PR was merged
</Expandable>

**Weekly Review-Ready → Merge Time**: Weekly trend of time from review-ready to merge.

**Time to Last Commit**: Duration from PR review-ready to final commit (or merge if no later commit). Shown as average, median, P75, and P90.

<Expandable title="Calculation details">
  `(last_commit - ready_for_review)` where:

  * `ready_for_review`: Timestamp when PR was marked ready for review (or creation date if never in draft)
  * `last_commit`: Timestamp of the last non-merge, non-rebased commit (or merge date if no new commits)
</Expandable>

**Weekly Review-Ready → Last Commit Time**: Weekly trend of time from review-ready to final commit.

**Time to First Human Review**: Duration from PR review-ready to first human review comment. Shown as average, median, P75, and P90.

<Expandable title="Calculation details">
  `(first_human_review - ready_for_review)` where:

  * `ready_for_review`: Timestamp when PR was marked ready for review (or creation date if never in draft)
  * `first_human_review`: Timestamp of the first review submitted by a human reviewer
</Expandable>

**Weekly Review-Ready → First Human Review Time**: Weekly trend of time from review-ready to first human review.

### Understanding time metrics

* **Average**: Overall average duration across all PRs
* **Median**: Typical duration (less affected by outliers)
* **P75**: 75th percentile, helps identify PRs taking longer than usual
* **P90**: 90th percentile, highlights potential bottlenecks

***

## Org Trends

**Weekly Pull Requests: Created & Merged**: Weekly counts of pull requests created and merged.

**Weekly Avg Comments per PR: CodeRabbit & Human**: Weekly average review comments posted by CodeRabbit and human reviewers.

**Weekly Active Users**: Weekly count of distinct users whose PRs were reviewed by CodeRabbit.

**Weekly Pipeline Failures**: Weekly trend of CI/CD pipeline failures detected during reviews.

**Most Active Pull Request Authors**: Top 10 contributors ranked by number of merged PRs.

**Most Active Pull Request Reviewers**: Top 10 contributors ranked by number of PRs reviewed.

***

## Data Metrics

**Active User Details**: Per-user summary of pull request activity and reviews.

<Expandable title="Fields included">
  * **PRs Created**: Number of PRs created by the user
  * **PRs Merged**: Number of PRs merged by the user
  * **Median Time to Last Commit**: Median time for PRs authored by the user
  * **Total Review Comments**: CodeRabbit comments posted on their PRs
  * **Overall Acceptance Rate**: Percentage of comments accepted
  * **Critical Comments**: Posted vs accepted
  * **Major Comments**: Posted vs accepted
  * **Other Comments**: Posted vs accepted
</Expandable>

**Pull Request Details**: Detailed review metrics for each merged pull request.

<Expandable title="Fields included">
  * **Repository**: Repository name
  * **Author**: PR author
  * **Created At**: PR creation timestamp
  * **First Human Review**: Timestamp of first human review
  * **Merged At**: PR merge timestamp
  * **Estimated Complexity**: AI-estimated PR complexity
  * **Estimated Review Time**: AI-estimated review effort
  * **Number of Human Reviewers**: Count of human reviewers
  * **Human Review Comment Count**: Comments from human reviewers
  * **Total CodeRabbit Comments**: Posted vs accepted
  * **Critical Comments**: Posted vs accepted
  * **Major Comments**: Posted vs accepted
  * **Other Comments**: Posted vs accepted
  * **Tool Findings**: Automated tool issues found
  * **Pipeline Failures**: CI/CD failures detected
</Expandable>

**Tool Finding Details**: Automated tool findings surfaced during review for merged pull requests.

<Expandable title="Fields included">
  * **Tool Name**: Name of the tool (e.g., ESLint, Semgrep)
  * **Category**: Rule type or issue category
  * **Severity**: Warning, error, grammar, style, or unknown
  * **Count**: Number of occurrences
</Expandable>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt


# Overview

> Track and analyze pull request activity across your organization's repositories with CodeRabbit's reporting feature. Set up scheduled reports or generate on-demand reports with customizable prompts.

<Info>
  This feature is available exclusively as part of the Pro plan and is not
  included in the Lite plan. Please refer to our [pricing
  page](https://www.coderabbit.ai/pricing) for more information about our plans
  and features.
</Info>

CodeRabbit's reporting feature helps you track pull request activity, review patterns, and team performance across your organization's repositories. Generate insights about code review cycles, contributor activity, and quality metrics to improve your development workflow.

## Report types

<CardGroup cols={2}>
  <Card title="Scheduled reports" href="/guides/scheduled-reports" icon="calendar">
    Set up automated, recurring reports delivered to your team on a schedule via
    email, Discord, Slack, or Teams. **Recommended for ongoing monitoring**.
  </Card>

  <Card title="On-demand reports" href="/guides/ondemand-reports" icon="play">
    Generate single reports instantly to test formats or get quick insights.
    Limited to one-time use—switch to scheduled reports for recurring needs.
  </Card>
</CardGroup>

<Tip>
  **Recommended approach**: Use scheduled reports for regular team updates and
  performance tracking. On-demand reports work best for testing report formats
  before setting up automation.
</Tip>

## Customize reports using natural language

For both scheduled and on-demand reports, you define the shape and content of your reports by providing a prompt that instructs CodeRabbit about report that you want, using natural language. The scheduled reports interface includes several example prompts that you can choose from, or you can write your own prompt. For more information, see [Customize reports](/guides/custom-reports).

## What's next

* [Schedule reports](/guides/scheduled-reports)
* [Generate reports on demand](/guides/ondemand-reports)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Review local changes

> Catch critical bugs, security issues, memory leaks before you commit. Right in your IDE with the CodeRabbit IDE extensions.

Get CodeRabbit's AI-powered code reviews directly in your IDE before you commit. Catch bugs, security issues, and code quality problems without leaving your development environment.

<Tip>
  Looking for the full CodeRabbit experience? This page covers local IDE
  reviews. For complete code reviews on pull requests, see
  [Introduction](/overview/introduction).
</Tip>

## Supported editors

The CodeRabbit extension works with VSCode and any editor that supports VSCode extensions:

<CardGroup cols={3}>
  <Card title="Visual Studio Code">
    Full native support for the official VSCode editor
  </Card>

  <Card title="Cursor">
    Compatible with Cursor's AI-powered development environment
  </Card>

  <Card title="Windsurf">
    Works seamlessly with Windsurf and other VSCode-compatible editors
  </Card>
</CardGroup>

Use the extension standalone for local development, or combine it with CodeRabbit's pull request reviews for comprehensive code quality coverage.

## Features

<CardGroup cols={2}>
  <Card title="Review uncommitted changes" icon="git-commit-vertical">
    Get instant reviews on uncommitted code as you develop. Catch issues before
    you even commit, reducing PR comment noise by 80%.
  </Card>

  <Card title="One-click fixes" icon="wrench">
    Apply simple suggested fixes instantly. Complex fixes get handed off to your
    AI agent with one click.
  </Card>

  <Card title="Fix all" icon="sparkles">
    New feature: Send all review comments and context to your coding agent at
    once for comprehensive fixes.
  </Card>

  <Card title="AI agent integration" icon="bot">
    Native integration with Copilot, Claude Code, Codex CLI, Cline, Roo, Kilo
    Code, Augment Code, plus clipboard fallback for any AI agent.
  </Card>

  <Card title="Context-aware reviews" icon="database">
    Paid users with linked GitHub accounts get full context: learnings, tools,
    and 40+ contextual sources for comprehensive analysis.
  </Card>

  <Card title="Detects coding agent files" icon="file-text">
    Automatically detects claude.md, Cursor rules, custom rules, and other
    coding agent files to apply your [team's
    standards](/guides/review-instructions) to every review.
  </Card>
</CardGroup>

## Pricing and capabilities

<CardGroup cols={2}>
  <Card title="Free tier" icon="gift">
    Basic reviews with limited daily usage. Perfect for trying out the extension
    and light development work.
  </Card>

  <Card title="Paid plans" icon="credit-card">
    Higher rate limits plus full context-aware reviews. Paid users with linked
    GitHub accounts get learnings, tools, and 40+ contextual sources.
  </Card>
</CardGroup>

<Tip>
  **Full feature parity**: Paid users now get nearly all PR review features in
  the IDE, including learnings and contextual analysis. Only chat, docstrings,
  and unit test generation remain exclusive to PR reviews. Note that PR reviews
  and IDE reviews will differ, even if ran on the same PR.
</Tip>

Contact [sales@coderabbit.ai](mailto:sales@coderabbit.ai) for custom rate limits or enterprise needs.

## Get started

<CardGroup cols={1}>
  <Card title="Install the VSCode extension" href="/guides/install-vscode" icon="download">
    Download and install the CodeRabbit extension for VSCode or compatible
    editors.
  </Card>

  <Card title="Use the VSCode extension" href="/guides/use-vscode" icon="play">
    Learn how to trigger reviews, apply fixes, and integrate with your
    development workflow.
  </Card>

  <Card title="Self-hosted setup" href="/guides/use-vscode-selfhosted" icon="server">
    Configure the extension to work with your self-hosted CodeRabbit instance.
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Install the VSCode extension

> Install the CodeRabbit VSCode extension to review code changes locally in your editor.

Install the CodeRabbit VSCode extension to review code changes directly in your editor. For more information about using the extension, see [Review local changes](/code-editors).

<Note>
  These instructions are specific to VSCode. If you're using a VSCode-compatible
  editor like Cursor or Windsurf, the steps are similar but may require some
  adaptation.
</Note>

## Before you begin

Before you can use the CodeRabbit VSCode extension, you need a CodeRabbit account.

<Info>
  Don't have an account yet? Create one by visiting [the CodeRabbit login
  page](https://app.coderabbit.ai/login?free-trial).
</Info>

## Install the extension

<Steps>
  <Step title="Open Extensions">
    In the editor activity bar, click **Extensions**.
  </Step>

  <Step title="Search for CodeRabbit">
    In the sidebar, type `coderabbit` into the **Search Extensions in Marketplace** search bar. **CodeRabbit** will appear as a search result.
  </Step>

  <Step title="Select the extension">
    Select **CodeRabbit**. A summary of the CodeRabbit VSCode extension appears in the main pane with installation controls.
  </Step>

  <Step title="Configure auto-update (optional)">
    If you want your editor to automatically check for and apply future updates to the extension, keep the **Auto Update** checkbox selected. Otherwise, clear the checkbox.
  </Step>

  <Step title="Install the extension">
    Click **Install**.
  </Step>

  <Step title="Log in to CodeRabbit">
    A **Log in to CodeRabbit to get started** dialog appears. Click **Login**.

    <Accordion title="If the login dialog is dismissed or times out">
      1. Click the CodeRabbit icon in the VSCode activity bar
      2. Click the **Use CodeRabbit for Free** button
    </Accordion>
  </Step>

  <Step title="Grant browser permission">
    Grant VSCode permission to open your browser, if asked.
  </Step>

  <Step title="Complete authentication">
    In your web browser, log into your CodeRabbit account.
  </Step>

  <Step title="Handle redirect (if needed)">
    After signing in, the browser will redirect you back to VSCode. If the redirect doesn't occur:

    1. Copy the code displayed in the success window
    2. Click **Paste code from browser** in VSCode
    3. Paste the code into the input field that appears
  </Step>
</Steps>

This connects your CodeRabbit account with the CodeRabbit VSCode extension.

## Install using the marketplace website

If you're using the VSCode IDE (not a derived IDE like Cursor or Windsurf), you can alternatively install the CodeRabbit extension by visiting [the extension's page on the Visual Studio Marketplace](https://coderabbit.link/vscode-docs).

<Warning>
  If you install the extension this way, you still need to connect your
  CodeRabbit account to the extension after installing it, as described in the
  previous section.
</Warning>

## What's next

<CardGroup cols={3}>
  <Card title="Use the VSCode extension" href="/guides/use-vscode">
    Learn how to review code changes with the extension
  </Card>

  <Card title="Configure the VSCode extension" href="/guides/config-vscode">
    Customize the extension settings for your workflow
  </Card>

  <Card title="Use with Self-hosted CodeRabbit" href="/guides/use-vscode-selfhosted">
    Set up the extension with your self-hosted instance
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Use the VSCode extension

> Review code changes in your local Git repository using the CodeRabbit VSCode extension with automatic or manual review options.

Review code changes directly in VSCode using the CodeRabbit extension. Choose between automatic reviews after every commit or manual reviews for specific changes.

<Note>
  These instructions are for VSCode. If you're using a VSCode-compatible editor
  like Cursor or Windsurf, the steps are similar but may require adaptation.
</Note>

## Choose your workflow

<CardGroup cols={2}>
  <Card title="Automatic reviews" icon="zap">
    Let CodeRabbit review every commit automatically
  </Card>

  <Card title="Manual reviews" icon="sliders-vertical">
    Control exactly what gets reviewed and when
  </Card>
</CardGroup>

## Automatic reviews

The simplest way to get code reviews. CodeRabbit automatically reviews all changes when you commit to your local Git repository.

<Steps>
  <Step title="Make a Git commit">
    Commit your changes using VSCode or terminal. A dialog appears asking
    **Would you like to start a review?**
  </Step>

  <Step title="Start the review">
    Click **Yes**. The CodeRabbit sidebar opens with the review in progress.
  </Step>

  <Step title="Wait for completion">
    The review typically completes within a few minutes. Click **Stop the
    review** to cancel if needed.
  </Step>
</Steps>

<Tip>
  You can configure the extension to always review automatically or never
  prompt. See [Configure automatic review
  behavior](/guides/config-vscode#auto-reviews).
</Tip>

## Manual reviews

Get precise control over what CodeRabbit reviews. Compare any branch against any other branch, review only committed changes, or focus on specific files.

<Steps>
  <Step title="Open CodeRabbit sidebar">
    Click the CodeRabbit icon in the VSCode activity bar.
  </Step>

  <Step title="Select base branch (optional)">
    Under **Branch** in the sidebar, click the base branch name to compare
    against a different branch.
  </Step>

  <Step title="Choose review scope">
    Select your review type:

    <Tabs>
      <Tab title="All changes">
        **Review all changes** - Includes both committed and uncommitted changes
      </Tab>

      <Tab title="Committed only">
        **Review committed changes** - Only changes you've committed locally
      </Tab>

      <Tab title="Uncommitted only">
        **Review uncommitted changes** - Only staged and unstaged changes
      </Tab>
    </Tabs>
  </Step>

  <Step title="Verify files to review">
    Check the **Files to review** list in the sidebar. Use `git stash` or change
    your review scope to modify which files are included.
  </Step>

  <Step title="Start the review">
    Click the review button. The sidebar shows progress as the review runs.
  </Step>
</Steps>

## Working with review results

After any review completes, CodeRabbit adds actionable comments to your code. Each comment includes specific suggestions you can apply directly or use as guidance.

### Browse and apply suggestions

Review comments appear in the **Files** section of the CodeRabbit sidebar. Click any comment to see the detailed suggestion inline in your editor.

When CodeRabbit provides a specific code fix, click the **Apply suggested change** checkmark icon to apply it immediately.

### Use AI coding agents

For complex issues, click the **Fix with AI** star icon to send the problem to your preferred AI coding agent:

* **VSCode + Copilot**: Sends directly to Copilot
* **Command-line tools**: Claude Code, Codex CLI, OpenCode - opens terminal with respective command
* **VSCode extensions**: Cline, Roo, Kilo Code, Augment Code - integrates with extension sidebars
* **Clipboard fallback**: Copies prompt for use with any AI agent

Configure your preferred AI agent in [extension settings](/guides/config-vscode#agent).

### Managing comments

* **Ignore**: Remove comment from editor view
* **Collapse**: Hide comment but keep indicator icon
* **Restore**: Click collapsed/ignored comments in sidebar to show again

## What's next

<CardGroup cols={2}>
  <Card title="Configure the extension" href="/guides/config-vscode">
    Customize automatic review behavior and AI agent integration
  </Card>

  <Card title="Uninstall the extension" href="/guides/uninstall-vscode">
    Remove the CodeRabbit extension from VSCode
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Cursor integration

> Enable Cursor to run the CodeRabbit CLI as part of your development workflow. Let AI code, review, and fix issues autonomously without human intervention.

<Info>
  This guide covers integrating CodeRabbit CLI with Cursor. For standalone CLI
  usage, see [CLI overview](/cli/overview).
</Info>

## Autonomous AI development workflows

CodeRabbit CLI + Cursor allows you to develop faster with code that gets reviewed for issues before it reaches the PR. Because Cursor executes CodeRabbit directly as part of its steps, code that gets made by Cursor can automatically be reviewed by CodeRabbit. Ask Cursor to implement a feature, run a code review, and fix any issues, as a natural part of agentic development.

## Video demo

<iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/Fx2TrJHkUc0" title="CodeRabbit CLI + Cursor integration demo" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />

## Why integrate these tools

<CardGroup cols={2}>
  <Card title="Expert issue detection" icon="search">
    CodeRabbit spots race conditions, memory leaks, and logic errors that generic linters miss. Same pattern recognition that powers our PR reviews.
  </Card>

  <Card title="AI-powered fixes" icon="wand">
    Cursor implements fixes with full context from CodeRabbit's analysis. Complex
    architectural changes are handled intelligently.
  </Card>

  <Card title="Context preservation" icon="brain">
    CodeRabbit's `--prompt-only` mode gives Cursor succinct context about issues, including location, severity, and suggested approaches.
  </Card>

  <Card title="Agentic development loop" icon="refresh-cw">
    Run a better agentic development loop - AI codes, runs reviews, applies fixes, and iterates before you even look at the code.
  </Card>
</CardGroup>

## Prerequisites

<Warning>
  **Windows users:** The CodeRabbit CLI requires WSL (Windows Subsystem for
  Linux) to run on Windows. See our [WSL on Windows guide](/cli/wsl-windows) for
  setup instructions before proceeding with this integration.
</Warning>

<Steps>
  <Step title="Install Cursor">
    Install Cursor and setup an account if needed.
  </Step>

  <Step title="Install CodeRabbit CLI">
    Install the CodeRabbit CLI globally on your system:

    ```bash  theme={null}
    curl -fsSL https://cli.coderabbit.ai/install.sh | sh
    ```

    Restart your shell:

    ```bash  theme={null}
    source ~/.zshrc
    ```
  </Step>

  <Step title="Authenticate CodeRabbit">
    Create an account or login to CodeRabbit if you already have one by running this command in your terminal:

    ```
    Run: coderabbit auth login
    ```

    The command provides a URL, open the URL in your browser, log in to CodeRabbit via your git provider, and copy the authentication token.

    Paste the token back to your CLI.

    <Info>
      Free accounts get a limited set of reviews per hour, and less comprehensive reviews. Pro accounts get higher review limits, and more robust reviews. See [https://www.coderabbit.ai/pricing](https://www.coderabbit.ai/pricing) for more details.
    </Info>
  </Step>

  <Step title="Verify auth">
    Verify authentication was successful by running in your terminal:

    ```
    Run: coderabbit auth status
    ```

    Success shows your login status and confirms everything is set correctly.
  </Step>

  <Step title="Test that Cursor can run CodeRabbit">
    Open up the chat interface in Cursor (Command +L) and prompt it:

    ```text wrap theme={null}
    Let's verify you can run the CodeRabbit CLI. Run the terminal command: coderabbit auth status and tell me the output.
    ```

    Because prompts and agents are non-deterministic, meaning every response will vary, and we can't predict with certainty every outcome, sometimes Cursor (and other agents) will try to install CodeRabbit as a package, or try to run other commands to determine what CodeRabbit is. In this case, it's recommended that you create a Cursor Rule, covered in the step below.
  </Step>

  <Step title="Setup a Cursor Rule for CodeRabbit">
    Learn more about Cursor rules in their [documentation](https://cursor.com/docs/context/rules). Create a Cursor rule by running the Cursor rule command from the chat `@rule`. Enter this prompt or modify it to fit your development preferences:

    ```text wrap theme={null}
      # Running the CodeRabbit CLI

      CodeRabbit is already installed in the terminal. Run it as a way to review your code. Run the command: cr -h for details on comands available. In general, I want you to run coderabbit with the `--prompt-only` flag. To review uncommitted changes (this is what we'll use most of the time) run: `coderrabit --prompt-only -t uncommitted`.

      IMPORTANT: When running CodeRabbit to review code changes, don't run it more than 3 times in a given set of changes.
    ```
  </Step>
</Steps>

## Integration workflow

### Use CodeRabbit as part of building new features

<Steps>
  <Step title="Request implementation + review">
    Ask Cursor to implement a feature and run CodeRabbit, analyze the suggestions and apply fixes:

    ```
    Please implement phase 7.3 of the planning doc and then run coderabbit --prompt-only -t uncommitted,
    let it run as long as it needs and fix any issues.
    ```

    Key components:

    * **Implement the feature**: Cursor codes the requested functionality
    * **Run CodeRabbit**: Uses `--prompt-only` flag for AI-optimized output
    * **Review uncommitted changes**: uses the flag `-t ucommitted` so CodeRabbit only reviews current changes as opposed to a feature branch or staging against `main`.
    * **Fix issues**: Cursor addresses all problems CodeRabbit identifies. You can also tell it to fix critical issues and ignore nits.
  </Step>

  <Step title="Cursor implements and runs CodeRabbit">
    Cursor: 1. Implements the requested feature 2. Runs `coderabbit --prompt-only
    	-t uncommitted` 3. Waits, reviews may take anywhere from 7-30 minutes
    depending on the amount of changes.
  </Step>

  <Step title="CodeRabbit analysis and task creation">
    When CodeRabbit completes, Cursor: 1. Reads the `--prompt-only` output
    (plain text optimized for AI agents) 2. Creates a task list addressing each
    issue CodeRabbit surfaced 3. Shows you the planned fixes before implementing
    them
  </Step>

  <Step title="Automated issue resolution">
    Cursor systematically works through the task list, implementing fixes for each CodeRabbit finding. The cycle continues until all issues are resolved or the limit of 3 times is reached which we set on a rule earlier.
  </Step>
</Steps>

### Example: API integration implementation

This example shows the workflow implementing a webhook handler for payment processing:

<Steps>
  <Step title="Start implementation">
    ```bash  theme={null}
    # Working on payment webhook feature
    git checkout -b feature/payment-webhooks
    ```
  </Step>

  <Step title="Run integrated workflow">
    Tell Cursor to implement and review:

    ```
    Implement the payment webhook handler from the spec document.
    Then run coderabbit --prompt-only -t uncommitted, review the suggestions then fix any critical issues. Ignore nits.
    ```
  </Step>

  <Step title="CodeRabbit analysis">
    CodeRabbit analyzes the webhook code and identifies issues: - Missing
    signature verification - Race conditions in payment state updates -
    Insufficient error handling for network failures - Webhook replay attack
    vulnerabilities
  </Step>

  <Step title="Cursor fixes">
    Cursor automatically applies fixes: - Adds HMAC signature verification -
    Implements database transactions for state consistency - Adds retry logic with
    exponential backoff - Includes idempotency key handling
  </Step>

  <Step title="Verification">
    The workflow continues until all critical issues are resolved or a set number of loops is reached. Cursor reports completion.
  </Step>
</Steps>

<Tip>
  The `--prompt-only` mode provides Cursor with token-efficient but succinct
  context about each issue, including file locations, problem descriptions, and
  suggested fixes.
</Tip>

## Optimization tips

### Use prompt-only mode for efficiency

When running CodeRabbit manually before Cursor, use `--prompt-only` for optimal AI agent integration:

```bash  theme={null}
coderabbit --prompt-only
```

This mode:

* Provides succinct issue context
* Uses token-efficient formatting
* Includes specific file locations and line numbers
* Suggests fix approaches without overwhelming detail

### Configure CodeRabbit for Cursor

CodeRabbit automatically reads your `cursor.md` file, so you can add context there on how code reviews should run, your coding standards, and architectural preferences.

<Info>This is a Pro paid plan feature.</Info>

## Troubleshooting

### CodeRabbit not finding issues

If CodeRabbit isn't detecting expected issues:

1. **Check authentication status**: Run `coderabbit auth status` (authentication improves review quality but isn't required)
2. **Verify git status**: CodeRabbit analyzes tracked changes - check `git status`
3. **Consider review type**: Use the `--type` flag to specify what to review:
   * `coderabbit --type uncommitted` - only uncommitted changes
   * `coderabbit --type committed` - only committed changes
   * `coderabbit --type all` - both committed and uncommitted (default)
4. **Specify base branch**: If your main branch isn't `main`, use `--base`:
   * `coderabbit --base develop`
   * `coderabbit --base master`
5. **Review file types**: CodeRabbit focuses on code files, not docs or configuration

### Managing review duration

CodeRabbit reviews may take 7 to 30+ minutes depending on the scope of changes:

1. **Ensure background execution**: Configure Cursor to run CodeRabbit in the background so you can continue working
2. **Review smaller changesets**: Adjust what you're reviewing to reduce analysis time:
   * Use `--type uncommitted` to review only uncommitted changes
   * Work on smaller feature branches compared to main
   * Break large features into smaller, reviewable chunks
3. **Configure the diff scope**: Control what changes are analyzed:
   * **Review uncommitted changes only**: Use `--type uncommitted` to analyze just working directory changes
   * **Configure base branch**: Use `--base develop` or `--base main` to set the comparison point
   * **Use feature branches**: Work on focused feature branches instead of large staging branches

<Note>
  The integration creates a more thorough review process than either tool alone.
  Expect comprehensive analysis that catches issues that would otherwise reach
  production.
</Note>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Overview

> Configure CodeRabbit to fit your organization and repositories using multiple approaches with clear priority rules.

CodeRabbit works out of the box with sensible defaults, but configuration lets you customize reviews for your team's specific needs. Choose from multiple configuration approaches based on your workflow preferences.

## Configuration approaches

<CardGroup cols={2}>
  <Card title="Organization settings" icon="building-2" href="/guides/organization-settings">
    Apply the same configuration to all repositories in your organization
  </Card>

  <Card title="Repository settings" icon="git-branch" href="/guides/repository-settings">
    Configure individual repositories with specific needs
  </Card>

  <Card title="YAML file" icon="file-code" href="/getting-started/yaml-configuration">
    Version-controlled configuration committed to your repository
  </Card>

  <Card title="Central configuration" icon="layers" href="/configuration/central-configuration">
    Organization-wide configuration from a dedicated repository
  </Card>
</CardGroup>

### Organization settings

Use organization settings when you want consistent CodeRabbit behavior across all your repositories. Configure once in the web UI and all repositories inherit the same settings.

Best for: Teams with standardized coding practices across projects.

See [Organization preferences](/guides/organization-settings).

### Repository settings

Use repository settings when different projects need different CodeRabbit configurations. Configure each repository individually through the web UI or with a local `.coderabbit.yaml` file.

Best for: Organizations with diverse projects requiring specific review approaches.

See [Repository preferences](/guides/repository-settings).

### YAML file (recommended)

Create a `.coderabbit.yaml` file in your repository root for version-controlled configuration. This approach gives you the benefits of infrastructure-as-code: configuration changes go through code review, maintain history, and deploy with your application.

Best for: Teams that prefer GitOps workflows and want configuration changes tracked in version control.

See the [configuration reference](/reference/configuration#reference) for all available options.

### Central configuration

Create a dedicated `coderabbit` repository in your organization with a `.coderabbit.yaml` file. This configuration automatically applies to any repository that doesn't have its own settings, giving you organization-wide defaults with the flexibility of repository-specific overrides.

Best for: Organizations wanting centralized configuration management without requiring individual repository setup.

See [Central configuration](/configuration/central-configuration) for setup instructions and platform support.

## Understanding configuration priority

When you use multiple configuration methods, CodeRabbit follows a strict priority hierarchy:

<Steps>
  <Step title="Local .coderabbit.yaml file">
    **Highest priority** - Completely overrides all other settings
  </Step>

  <Step title="Central configuration">
    **High priority** - Organization-wide defaults from dedicated repository
  </Step>

  <Step title="Repository settings">
    **Medium priority** - Web UI settings for individual repositories
  </Step>

  <Step title="Organization settings">
    **Lowest priority** - Web UI settings for entire organization
  </Step>
</Steps>

<Warning>
  Configuration sources don't merge. The highest priority source completely
  replaces all lower priority sources. If your local YAML file doesn't define a
  setting, CodeRabbit uses the default value, not your organization or
  repository settings.
</Warning>

**Example:** If you set a custom timeout in organization settings and central configuration but have a local `.coderabbit.yaml` that doesn't mention timeouts, CodeRabbit uses the default timeout value, not your organization or central configuration settings.

## Learnings: Adaptive configuration

Beyond manual configuration, CodeRabbit automatically builds learnings about your team's review preferences based on your interactions with review comments over time. This creates a dynamic, self-improving configuration layer.

Learnings capture patterns like:

* Which types of suggestions your team typically accepts or rejects
* Coding standards specific to your repositories
* Review focus areas that matter most to your workflow

These learnings work alongside your manual configuration to fine-tune reviews without requiring constant adjustment of settings.

<Tip>
  Learnings complement rather than replace manual configuration. Use both
  together for the most tailored review experience.
</Tip>

See [Teach CodeRabbit your review preferences](/guides/learnings) for details on how learnings work and how to manage them.


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Overview

> Configure CodeRabbit to fit your organization and repositories using multiple approaches with clear priority rules.

CodeRabbit works out of the box with sensible defaults, but configuration lets you customize reviews for your team's specific needs. Choose from multiple configuration approaches based on your workflow preferences.

## Configuration approaches

<CardGroup cols={2}>
  <Card title="Organization settings" icon="building-2" href="/guides/organization-settings">
    Apply the same configuration to all repositories in your organization
  </Card>

  <Card title="Repository settings" icon="git-branch" href="/guides/repository-settings">
    Configure individual repositories with specific needs
  </Card>

  <Card title="YAML file" icon="file-code" href="/getting-started/yaml-configuration">
    Version-controlled configuration committed to your repository
  </Card>

  <Card title="Central configuration" icon="layers" href="/configuration/central-configuration">
    Organization-wide configuration from a dedicated repository
  </Card>
</CardGroup>

### Organization settings

Use organization settings when you want consistent CodeRabbit behavior across all your repositories. Configure once in the web UI and all repositories inherit the same settings.

Best for: Teams with standardized coding practices across projects.

See [Organization preferences](/guides/organization-settings).

### Repository settings

Use repository settings when different projects need different CodeRabbit configurations. Configure each repository individually through the web UI or with a local `.coderabbit.yaml` file.

Best for: Organizations with diverse projects requiring specific review approaches.

See [Repository preferences](/guides/repository-settings).

### YAML file (recommended)

Create a `.coderabbit.yaml` file in your repository root for version-controlled configuration. This approach gives you the benefits of infrastructure-as-code: configuration changes go through code review, maintain history, and deploy with your application.

Best for: Teams that prefer GitOps workflows and want configuration changes tracked in version control.

See the [configuration reference](/reference/configuration#reference) for all available options.

### Central configuration

Create a dedicated `coderabbit` repository in your organization with a `.coderabbit.yaml` file. This configuration automatically applies to any repository that doesn't have its own settings, giving you organization-wide defaults with the flexibility of repository-specific overrides.

Best for: Organizations wanting centralized configuration management without requiring individual repository setup.

See [Central configuration](/configuration/central-configuration) for setup instructions and platform support.

## Understanding configuration priority

When you use multiple configuration methods, CodeRabbit follows a strict priority hierarchy:

<Steps>
  <Step title="Local .coderabbit.yaml file">
    **Highest priority** - Completely overrides all other settings
  </Step>

  <Step title="Central configuration">
    **High priority** - Organization-wide defaults from dedicated repository
  </Step>

  <Step title="Repository settings">
    **Medium priority** - Web UI settings for individual repositories
  </Step>

  <Step title="Organization settings">
    **Lowest priority** - Web UI settings for entire organization
  </Step>
</Steps>

<Warning>
  Configuration sources don't merge. The highest priority source completely
  replaces all lower priority sources. If your local YAML file doesn't define a
  setting, CodeRabbit uses the default value, not your organization or
  repository settings.
</Warning>

**Example:** If you set a custom timeout in organization settings and central configuration but have a local `.coderabbit.yaml` that doesn't mention timeouts, CodeRabbit uses the default timeout value, not your organization or central configuration settings.

## Learnings: Adaptive configuration

Beyond manual configuration, CodeRabbit automatically builds learnings about your team's review preferences based on your interactions with review comments over time. This creates a dynamic, self-improving configuration layer.

Learnings capture patterns like:

* Which types of suggestions your team typically accepts or rejects
* Coding standards specific to your repositories
* Review focus areas that matter most to your workflow

These learnings work alongside your manual configuration to fine-tune reviews without requiring constant adjustment of settings.

<Tip>
  Learnings complement rather than replace manual configuration. Use both
  together for the most tailored review experience.
</Tip>

See [Teach CodeRabbit your review preferences](/guides/learnings) for details on how learnings work and how to manage them.


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Repository preferences

> Configure CodeRabbit's behavior for individual repositories using .coderabbit.yaml files or the web interface. Learn about configuration precedence and best practices.

## About repository settings

CodeRabbit provides three ways to manage its code-review behavior with each of your organization's repositories:

<CardGroup cols={3}>
  <Card title="Configuration file" icon="file-code">
    Add a `.coderabbit.yaml` file to your repository for version-controlled
    settings
  </Card>

  <Card title="Central configuration" icon="building">
    Apply organization-wide settings that inherit to all repositories
    automatically
  </Card>

  <Card title="Web interface" icon="browser">
    View or modify your per-repository settings using the CodeRabbit dashboard
  </Card>
</CardGroup>

### Configuration precedence

CodeRabbit applies settings in the following order:

<Steps>
  <Step title="Repository YAML file (highest priority)">
    If your repository contains a `.coderabbit.yaml` file at the top level of
    its default branch, CodeRabbit applies all settings from this file
  </Step>

  <Step title="Repository web interface settings">
    If your repository doesn't have a `.coderabbit.yaml` file, CodeRabbit
    applies the configuration from the repository's web interface settings
  </Step>

  <Step title="Central configuration (organization-wide)">
    Settings from your organization's central configuration are applied to
    repositories that don't have repository-specific settings
  </Step>

  <Step title="Default values (lowest priority)">
    CodeRabbit applies its own default values to any configuration settings not
    defined elsewhere
  </Step>
</Steps>

## Configure your repository with `.coderabbit.yaml`

<Card title="Learn more about YAML configuration" icon="file-text" href="/getting-started/yaml-configuration">
  Complete guide to adding and customizing configuration files
</Card>

## Browse and modify your settings using the web interface

To view or modify your repository settings using the CodeRabbit web interface:

<Steps>
  <Step title="Open repository settings">
    Visit [the CodeRabbit web
    interface](https://app.coderabbit.ai/settings/repositories) and click
    **Repositories** in the sidebar
  </Step>

  <Step title="Select repository">
    Click the gear-shaped **Settings** icon of the repository whose settings you
    want to view or modify
  </Step>

  <Step title="Configure inheritance">
    If the **Use Organization Settings** toggle is on, click it to turn it off
    to customize this repository's settings

    <Note>
      If you leave the toggle on, CodeRabbit applies settings from [the
      organization-configuration page](/guides/organization-settings) to this
      repository
    </Note>
  </Step>

  <Step title="Apply changes">
    Browse and modify the settings using the UI form or switch to YAML mode for
    text-based editing. Click **Apply Changes** when you are finished
  </Step>
</Steps>

### UI vs YAML editing modes

The web interface provides two ways to edit your repository settings:

* **UI mode (default)**: Interactive form with dropdowns, checkboxes, and input fields
* **YAML mode**: Direct YAML editing with syntax highlighting and real-time validation

Switch between modes using the **Edit YAML** button at the top of the settings page (which changes to **Return to UI** when in YAML mode).
Changes made in either mode are reflected when switching between them.
When using YAML mode:

* Only non-default values are displayed for cleaner configuration
* Changes are validated in real-time as you type
* You can copy the entire YAML configuration to your clipboard
* The YAML structure matches `.coderabbit.yaml` format for easy transfer between web interface and repository files

<Note>
  Validation errors must be resolved before saving changes or switching back to
  UI mode.
</Note>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Configuration via YAML File

> Learn how to configure CodeRabbit using a YAML file for advanced customization.

In this guide, we will cover the configuration using a YAML file. For reference, you can find curated examples of YAML configurations in our [`awesome-coderabbit`](https://github.com/coderabbitai/awesome-coderabbit) repository.

## Configure CodeRabbit using a YAML File

<Note>
  `.coderabbit.yaml` configuration file must be located in the root of the
  repository. The configuration present in the feature branch under review will
  be automatically detected and used by CodeRabbit for that review.
</Note>

<Check>
  Move existing UI configuration to a YAML file?

  Use the `@coderabbitai configuration` command on any PR to get the current configuration in a YAML format. You can then copy the configuration to a `.coderabbit.yaml` file in the root of your repository.
</Check>

### Example Configuration

```yaml .coderabbit.yaml theme={null}
# yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json
language: "en-US"
early_access: false
reviews:
  profile: "chill"
  request_changes_workflow: false
  high_level_summary: true
  poem: true
  review_status: true
  collapse_walkthrough: false
  auto_review:
    enabled: true
    drafts: false
chat:
  auto_reply: true
```

## Configuration Options

The configuration file supports numerous options for customizing CodeRabbit's behavior. For the complete list of available configuration options and their descriptions, see the [configuration reference](/reference/configuration#reference).

<CardGroup cols={2}>
  <Card title="Configuration Reference" icon="book" href="/reference/configuration">
    Complete documentation of all options
  </Card>
</CardGroup>

Please note that code reviews commence with new pull requests or incremental commits to existing pull requests once the CodeRabbit app is installed. Should you have any questions or require assistance, our support team is here to help.

## Shared configuration

<Warning>
  Shared configuration is not recommended, as it may expose sensitive
  configuration details. Please use [Central
  Configuration](/configuration/central-configuration) for managing
  configurations across multiple repositories and [Configuration
  Inheritance](/configuration/configuration-inheritance) for reusing
  configurations across different layers.
</Warning>

If you are self-hosting CodeRabbit in an air-gapped environment, you can use the shared configuration feature to share the configuration across multiple repositories.

To use shared configuration, you need to:

1. Create a `.coderabbit.yaml` file and host it in a location that is publicly accessible (e.g., a web server, a public GitHub Gist).
2. Create a `.coderabbit.yaml` file in the root of your repository with the following content:

```yaml  theme={null}
remote_config:
  url: "https://your-config-location/.coderabbit.yaml"
```


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Central configuration

> Manage CodeRabbit settings across all repositories from a single central location, eliminating per-repository configuration updates.

Maintain CodeRabbit configuration for your entire organization in one dedicated repository. Create a `coderabbit` repository in your organization and add your `.coderabbit.yaml` file - CodeRabbit automatically applies these settings to any repository that doesn't have its own configuration.

<CardGroup cols={2}>
  <Card title="Organization-wide consistency" icon="building-2">
    Single source of truth for code review standards across all repositories
  </Card>

  <Card title="Simplified management" icon="settings">
    Update settings once instead of modifying each repository individually
  </Card>
</CardGroup>

<Card title="Configuration hierarchy" icon="layers">
  Repository configs override central configs, which override organization
  defaults - giving you flexibility when needed
</Card>

## How configuration resolution works

CodeRabbit checks for configuration in this priority order:

| Priority    | Source                | Location                                      |
| ----------- | --------------------- | --------------------------------------------- |
| 1 (Highest) | Repository file       | `.coderabbit.yaml` in the repository          |
| 2           | Central repository    | `.coderabbit.yaml` in `coderabbit` repository |
| 3           | Repository settings   | CodeRabbit UI - Repository Settings           |
| 4           | Organization settings | CodeRabbit UI - Organization Settings         |
| 5 (Lowest)  | Default settings      | CodeRabbit schema defaults                    |

The configuration source appears in the CodeRabbit comment on the pull request:

* **Repository file**: `Path: .coderabbit.yaml`
* **Central repository**: `Repository: coderabbit/.coderabbit.yaml`
* **UI settings**: `CodeRabbit UI`

## Setup

<Warning>
  **Critical requirement**: You must install CodeRabbit on the central
  `coderabbit` repository. CodeRabbit needs access to read the configuration
  file.
</Warning>

<Steps>
  <Step title="Create the central repository">
    Create a repository named `coderabbit` in your organization. The location depends on your platform:

    * **GitHub**: `organization/coderabbit`
    * **GitLab**: `group/coderabbit` (or `group/subgroup/coderabbit` for nested
      groups)
    * **Azure DevOps**: `project/coderabbit`
    * **Bitbucket Cloud**: `workspace/coderabbit`
  </Step>

  <Step title="Add your configuration">
    Create a `.coderabbit.yaml` file in the repository root with your
    organization's settings:

    ```yaml  theme={null}
    # yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json
    reviews:
      in_progress_fortune: false
      profile: chill
      request_changes_workflow: true
      high_level_summary: true
      poem: false
      review_status: true
      auto_review:
        enabled: true
        drafts: true
    chat:
      art: false
    ```
  </Step>

  <Step title="Install CodeRabbit">
    Install CodeRabbit on the central `coderabbit` repository through your
    platform's installation process.
  </Step>

  <Step title="Verify configuration">
    Check a repository that doesn't have its own `.coderabbit.yaml` file. The
    configuration source should show `Repository: coderabbit/.coderabbit.yaml`
    in the CodeRabbit UI.
  </Step>
</Steps>

## GitLab hierarchical configuration

GitLab supports team-specific configurations through its nested group structure. CodeRabbit automatically finds the closest `coderabbit` repository in your group hierarchy, allowing different teams to have their own settings while maintaining organization-wide defaults.

**Configuration inheritance example**:

| Project path                      | Configuration used                  |
| --------------------------------- | ----------------------------------- |
| `company/team-a/subteam/project1` | `company/team-a/subteam/coderabbit` |
| `company/team-a/project2`         | `company/team-a/coderabbit`         |
| `company/team-b/project3`         | `company/coderabbit`                |

This enables team-specific configurations with automatic fallback to parent group settings.

## Platform limitations

* **Azure DevOps**: Each project requires its own `coderabbit` repository - no cross-project configuration sharing
* **Bitbucket Server**: Central configuration not yet implemented - use individual repository settings

## Repository overrides

Individual repositories can override central configuration by adding their own `.coderabbit.yaml` file.

```yaml  theme={null}
# yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json
# Repository-specific config
reviews:
  profile: assertive
  high_level_summary: true
  poem: true
  review_status: true
  auto_review:
    enabled: true
    drafts: false
chat:
  art: true
```

When a repository has its own configuration file, CodeRabbit uses that instead of the central configuration. Repository settings take precedence over central settings.

## Related topics

* [Configuration overview](/guides/configuration-overview) - Understanding CodeRabbit configuration options
* [Organization settings](/guides/organization-settings) - Managing organization-level settings
* [Repository settings](/guides/repository-settings) - Configuring individual repositories
* [Configuration reference](/reference/configuration#reference) - Complete configuration reference


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Configuration inheritance

> Learn how CodeRabbit merges configuration settings across multiple levels, from repository files to organization defaults.

Configuration inheritance allows you to share common settings across repositories while still allowing individual repositories to customize specific values. When enabled, CodeRabbit merges configuration from parent levels instead of using only the highest-priority source.

<Note>
  Inheritance is **disabled by default**. You must explicitly enable it by
  adding `inheritance: true` to your configuration file.
</Note>

## Enabling inheritance

Add `inheritance: true` at the root level of your `.coderabbit.yaml` file:

```yaml  theme={null}
# yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json
inheritance: true
reviews:
  profile: chill
  auto_review:
    enabled: true
```

When inheritance is enabled:

1. CodeRabbit merges values from the parent configuration level
2. If the parent also has `inheritance: true`, the chain continues to the grandparent level
3. The chain stops at the first level where `inheritance:false` or not set

## Configuration hierarchy

CodeRabbit resolves configuration from multiple levels. Without inheritance, only the highest-priority source is used. With inheritance enabled, values merge across levels.

### Cloud/SaaS deployment

| Priority    | Source          | Location                                      |
| ----------- | --------------- | --------------------------------------------- |
| 1 (Highest) | Repository YAML | `.coderabbit.yaml` in the repository          |
| 2           | Central YAML    | `.coderabbit.yaml` in `coderabbit` repository |
| 3           | Repository UI   | CodeRabbit UI - Repository Settings           |
| 4           | Organization UI | CodeRabbit UI - Organization Settings         |
| 5 (Lowest)  | Defaults        | CodeRabbit schema defaults                    |

### Self-hosted deployment

| Priority    | Source           | Location                                      |
| ----------- | ---------------- | --------------------------------------------- |
| 1 (Highest) | Repository YAML  | `.coderabbit.yaml` in the repository          |
| 2           | Central YAML     | `.coderabbit.yaml` in `coderabbit` repository |
| 3           | Environment YAML | `YAML_CONFIG` environment variable            |
| 4 (Lowest)  | Defaults         | CodeRabbit schema defaults                    |

## How inheritance works

When you enable inheritance, CodeRabbit walks up the configuration hierarchy and merges values. The merge behavior depends on the data type.

### How the inheritance chain works

```
Repository YAML (inheritance: true)
       ↓ merges with
Central YAML (inheritance: true)
       ↓ merges with
Organization UI (inheritance: false)
       ✗ chain stops here
```

* Each level with `inheritance: true` merges with its parent
* The chain stops at the first level where `inheritance:false` or unset
* Missing configuration levels are skipped automatically

### Merge behavior by type

| Type        | Behavior                                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| **Objects** | Deep merge - child properties override parent properties at each nesting level                                 |
| **Arrays**  | Child items first, then unique parent items appended (deduplicated by `path`, `label`, `name`, `id`, or `key`) |
| **Scalars** | Simple override - child value wins when defined                                                                |

### Example

This example demonstrates all three merge behaviors.

**Repository configuration** (`.coderabbit.yaml`):

```yaml  theme={null}
inheritance: true
language: "de-DE"
reviews:
  profile: assertive
  auto_review:
    drafts: false
  path_instructions:
    - path: "src/**"
      instructions: "Use strict TypeScript settings"
    - path: "api/**"
      instructions: "Validate API contracts"
```

**Central configuration** (`coderabbit/.coderabbit.yaml`):

```yaml  theme={null}
inheritance: true
language: "en-US"
reviews:
  profile: chill
  request_changes_workflow: true
  high_level_summary: true
  auto_review:
    enabled: true
    drafts: true
  path_instructions:
    - path: "src/**"
      instructions: "Follow our coding standards"
    - path: "docs/**"
      instructions: "Check for grammar and clarity"
    - path: "tests/**"
      instructions: "Ensure adequate test coverage"
chat:
  art: false
```

**Merged result**:

```yaml  theme={null}
language: "de-DE" # scalar: child wins
reviews:
  profile: assertive # scalar: child wins
  request_changes_workflow: true # object: inherited from central
  high_level_summary: true # object: inherited from central
  auto_review:
    enabled: true # object: inherited from central
    drafts: false # scalar: child wins
  path_instructions: # array: child-first, then unique parent items
    - path: "src/**"
      instructions: "Use strict TypeScript settings" # from repo
    - path: "api/**"
      instructions: "Validate API contracts" # from repo
    - path: "docs/**"
      instructions: "Check for grammar and clarity" # from central (unique)
    - path: "tests/**"
      instructions: "Ensure adequate test coverage" # from central (unique)
chat:
  art: false # object: inherited from central
```

<Note>
  The `src/**` path instruction from central is excluded because the repository
  already defines the same `path`. Arrays deduplicate using the first available
  stable key: `path`, `label`, `name`, `id`, or `key`.
</Note>

## Common use cases

### Organization-wide defaults

Set up common settings in your central `coderabbit` repository, then enable inheritance in individual repositories to use those defaults while customizing specific values.

**Central configuration** (`organization/coderabbit/.coderabbit.yaml`):

```yaml  theme={null}
inheritance: true
reviews:
  profile: chill
  request_changes_workflow: true
  high_level_summary: true
  path_instructions:
    - path: "**/*.test.*"
      instructions: "Verify test coverage and edge cases"
chat:
  art: false
```

**Repository configuration** (`organization/my-repo/.coderabbit.yaml`):

```yaml  theme={null}
inheritance: true
reviews:
  profile: assertive # This repo needs stricter reviews
  path_instructions:
    - path: "src/api/**"
      instructions: "Ensure backward compatibility"
```

The repository inherits all central settings but uses an assertive review profile and adds API-specific instructions.

### Team-specific configurations (GitLab)

GitLab's nested group structure allows team-specific configurations. Each team can have their own `coderabbit` repository with settings that inherit from parent groups.

```
company/coderabbit                     # Organization defaults
company/backend/coderabbit             # Backend team settings (inherits from company)
company/backend/payments/coderabbit    # Payments team settings (inherits from backend)
```

Each level can enable inheritance to merge with its parent while adding team-specific customizations.

## Related topics

* [Central configuration](/configuration/central-configuration) - Set up organization-wide configuration
* [YAML configuration](/getting-started/yaml-configuration) - Configuration file reference
* [Organization settings](/guides/organization-settings) - Managing organization-level settings
* [Repository settings](/guides/repository-settings) - Configuring individual repositories


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Knowledge base

> Connect CodeRabbit to your team's tools and practices with adaptive AI that learns from your feedback and automatically detects your coding standards.

CodeRabbit's knowledge base makes reviews smarter by learning from your team's practices and integrating with your existing development tools. The AI adapts to your coding standards, remembers your preferences, and connects code changes to business context.

## Core capabilities

<CardGroup cols={3}>
  <Card title="Adaptive learnings" icon="brain">
    AI remembers your team's review preferences and improves over time
  </Card>

  <Card title="Code guidelines" icon="file-text">
    Automatic detection of team rules from .cursorrules, CLAUDE.md, and other AI
    agent files
  </Card>

  <Card title="Issue tracking" icon="bug">
    Connect with Jira, Linear, and GitHub Issues for better context
  </Card>
</CardGroup>

## Learnings: AI that adapts to your team

Train CodeRabbit to understand your team's specific preferences through natural conversation. The AI remembers your feedback and applies it to future reviews.

### Repository-wide preferences

Tell CodeRabbit about general coding standards for your entire repository:

```md  theme={null}
@coderabbitai always remember to enforce camelCase variable naming
```

```md  theme={null}
@coderabbitai we prefer functional components over class components in React
```

### Line-specific context

Add context for specific code patterns by commenting directly on lines:

```md  theme={null}
@coderabbitai do not complain about lack of error handling here,
it is handled higher up the execution stack
```

```md  theme={null}
@coderabbitai this timeout value is intentionally high for batch operations
```

Learnings work across pull requests, so CodeRabbit won't repeat suggestions your team has already addressed.

See [Teach CodeRabbit your review preferences](/guides/learnings) for advanced learning techniques.

## Code guidelines: Automatic team rules

CodeRabbit automatically detects and applies your team's coding standards from popular AI agent configuration files. No setup required - if you're already using AI coding tools, CodeRabbit understands your rules.

### Supported configuration files

<Accordion title="Automatically detected files">
  CodeRabbit scans for these patterns in your repositories:

  * **`.cursorrules`** - Cursor AI editor rules
  * **`.github/copilot-instructions.md`** - GitHub Copilot instructions
  * **`CLAUDE.md`** - Claude Code configuration files
  * **`.cursor/rules/`** - Cursor configuration directory
  * **`.windsurfrules`** - Windsurf editor rules
  * **`.clinerules/`** - Cline AI agent configuration
  * **`agent.md`** and **`agents.md`** - AI agent instructions and guidelines
  * **`.rules/`** - Generic team rules directory

  CodeRabbit applies these rules during code review automatically.
</Accordion>

This means if you've already configured coding standards for Cursor, Claude, or other AI tools, CodeRabbit will follow the same guidelines. Your team's standards stay consistent across all AI interactions.

<Tip>
  Code guidelines work best when combined with learnings. Use guidelines for
  static rules and learnings for dynamic team preferences.
</Tip>

## Setup and configuration

### Enable knowledge base features

1. **Learnings**: Enabled by default. Start using `@coderabbitai` commands in pull request comments.

2. **Code guidelines**: Automatic detection enabled by default. Add supported configuration files to your repository root.

3. **Issue tracking**: Requires setup. See [Issue integrations](/integrations/issue-integrations) for platform-specific instructions.

### Best practices

* **Start with learnings**: Use `@coderabbitai` commands to teach preferences incrementally
* **Centralize guidelines**: Put team rules in `.cursorrules` or `CLAUDE.md` files at repository root
* **Be specific**: Clear, actionable guidelines work better than vague preferences
* **Review and iterate**: Check how CodeRabbit applies learnings and refine as needed

## Advanced usage

### Cross-repository learning

Learnings can apply across repositories in your organization, helping maintain consistent standards across all projects.

### Team collaboration

Multiple team members can contribute learnings. CodeRabbit synthesizes feedback from different reviewers to understand team consensus.

### Integration with AI agents

Code guidelines ensure consistency between CodeRabbit reviews and your existing AI coding assistants, creating a unified development experience.

## What's next

<CardGroup cols={2}>
  <Card title="Issue integrations" href="/integrations/issue-integrations">
    Connect Jira, Linear, and GitHub Issues for better context
  </Card>

  <Card title="Advanced learnings" href="/guides/learnings">
    Master CodeRabbit's adaptive AI capabilities
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Learnings

> Teach CodeRabbit your review preferences using natural-language chat

For a conceptual overview of CodeRabbit configuration methods, see [Configure CodeRabbit](/guides/configuration-overview). For more information about performing code reviews with CodeRabbit, see [Review pull requests](/guides/code-review-overview).

## About CodeRabbit learnings

As your team works with CodeRabbit, it learns your team's code-review preferences based on chat interactions, and adds these preferences to an internal database that it associates with your Git platform organization. We call these internal records *learnings*.

<img src="https://mintcdn.com/coderabbit/8oAyj_Y4qh62mQR0/images/guides/assets/images/learnings-chat-demo.png?fit=max&auto=format&n=8oAyj_Y4qh62mQR0&q=85&s=2538776ab87cff7e07ce7ce10fe38472" alt="CodeRabbit learnings interface" data-og-width="3126" width="3126" data-og-height="1568" height="1568" data-path="images/guides/assets/images/learnings-chat-demo.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/coderabbit/8oAyj_Y4qh62mQR0/images/guides/assets/images/learnings-chat-demo.png?w=280&fit=max&auto=format&n=8oAyj_Y4qh62mQR0&q=85&s=df241e7f28167a6bbcbb68dbb6641751 280w, https://mintcdn.com/coderabbit/8oAyj_Y4qh62mQR0/images/guides/assets/images/learnings-chat-demo.png?w=560&fit=max&auto=format&n=8oAyj_Y4qh62mQR0&q=85&s=9fe0df940e8a29d5b6ae2024b989fa37 560w, https://mintcdn.com/coderabbit/8oAyj_Y4qh62mQR0/images/guides/assets/images/learnings-chat-demo.png?w=840&fit=max&auto=format&n=8oAyj_Y4qh62mQR0&q=85&s=e3482fbf9f69b2098b549fa52b9ab722 840w, https://mintcdn.com/coderabbit/8oAyj_Y4qh62mQR0/images/guides/assets/images/learnings-chat-demo.png?w=1100&fit=max&auto=format&n=8oAyj_Y4qh62mQR0&q=85&s=d96d2e13a04dfa93c0c2540c5f6920ad 1100w, https://mintcdn.com/coderabbit/8oAyj_Y4qh62mQR0/images/guides/assets/images/learnings-chat-demo.png?w=1650&fit=max&auto=format&n=8oAyj_Y4qh62mQR0&q=85&s=2cdf4a34f37fa76c62c1ee24f0944abd 1650w, https://mintcdn.com/coderabbit/8oAyj_Y4qh62mQR0/images/guides/assets/images/learnings-chat-demo.png?w=2500&fit=max&auto=format&n=8oAyj_Y4qh62mQR0&q=85&s=1ea01aae43b28df12dbd5aefc8e78b5e 2500w" />

CodeRabbit learnings are flexible, natural-language statements about code-review preferences whose purpose can include the following:

* Special instructions about reviewing particular files.
* Guidance for reviewing all of the files of one repository.
* Code-review preferences that CodeRabbit must apply across all of your organization's repositories.

<iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/Yu0cmmOYA-U" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />

Every time CodeRabbit prepares to add a comment to a pull request or issue, it loads the learnings that apply based on your [configured scope](#specify-the-scope-of-learnings). Depending on your settings, CodeRabbit applies either the repository's learnings only, or all of your organization's learnings. CodeRabbit uses these learnings as additional context or instructions for its comment.

Use learnings for incremental preferences that emerge during code reviews—preferences that don't require a formal configuration change but should be applied to future reviews. Use [review instructions](/guides/review-instructions) or coding guidelines for formal, documented standards.

You can review and edit your organization's CodeRabbit learnings at any time, as detailed later in this page.

## Add learnings

### Adding a learning via comment

To add learnings to the database CodeRabbit keeps about your organization's preferences, communicate your preferences using natural language, in a comment attached to any pull request or issue.

If CodeRabbit decides to create one or more learnings based on a comment, then it makes this explicit in its response to that comment by adding a collapsible section titled **Learnings Added** to its own response comment.

Imagine a scenario where CodeRabbit has reviewed a GitHub-based pull request from your team that adds a feature to an authentication middleware library. CodeRabbit has flagged a certain file as needing improvement, attaching this comment to the relevant lines in its review:

> Consider using nested try-catch blocks here to handle different error scenarios more comprehensively.

If this critique disagrees with your team's coding practices specific to try-catch blocks, then you can reply to this CodeRabbit using a comment of your own, addressed to the `@coderabbitai` service account on GitHub:

> @coderabbitai Actually, we've found that nested try-catch blocks make our auth middleware harder to debug in production. We prefer early returns with specific error codes - it's cleaner and our monitoring tools can track them better.

CodeRabbit considers your reply, and decides to make a learning out of it. It acknowledges this in another reply:

> You're absolutely right about the debugging benefits. Early returns with specific error codes do provide better clarity and monitoring capabilities. I'll remember this preference for your authentication middleware. Thank you for the guidance!

CodeRabbit also adds a **Learnings added** section to this comment, making explicit the fact that this chat has modified its future behavior with your team.

CodeRabbit then creates a new learnings record for itself. Along with metadata such as the pull request number, filename, and GitHub user associated with the learning, CodeRabbit adds this self-instructive text to the new record:

> In authentication middleware, prefer returning early with specific error codes rather than nested try-catch blocks. This improves readability and makes error tracking easier in production environments.

### Add learnings from files

You can import content from any file in your repository as learnings. This is useful for converting existing team documentation into learnings that CodeRabbit will apply during reviews.

To import a file as learnings, mention the file in a pull request comment:

```md  theme={null}
@coderabbitai add a learning using docs/coding-standards.md
```

CodeRabbit reads the file contents and creates corresponding learnings. This is useful when:

* Converting existing team documentation into CodeRabbit learnings
* Bulk-adding multiple preferences at once
* Importing learnings from an exported CSV file

<Note>
  If you have AI agent configuration files like `.cursorrules`, `CLAUDE.md`, or
  `.github/copilot-instructions.md`, use [code
  guidelines](/integrations/knowledge-base#code-guidelines:-automatic-team-rules)
  instead. CodeRabbit automatically detects and applies these files without
  manual import.
</Note>

### Best practices for new learnings

When communicating with CodeRabbit during an active code review, follow these practices to create effective learnings:

#### Consider if it's a pattern or a one-off

Determine whether a correction represents a team-wide preference that should apply to all future reviews, or a situation specific to this pull request.

Not every correction should become a learning. For one-time exceptions, such as unusual temporary code patterns during a migration, resolve the comment without creating a learning. For systemic preferences that should persist across reviews, provide feedback that CodeRabbit can store as a learning.

#### Explain the why, not just the what

Don't just tell CodeRabbit what to do, explain the reasoning. The "why" helps CodeRabbit apply the learning correctly in similar-but-not-identical situations:

<CodeGroup>
  ```md Less effective theme={null}
  @coderabbitai Don't suggest adding user IDs to error messages.
  ```

  ```md More effective theme={null}
  @coderabbitai We intentionally keep user IDs out of error messages
  because they end up in logs that get shipped to third-party monitoring.
  We track user context separately via our tracing system instead.
  ```
</CodeGroup>

#### Reply to specific comments for maximum context

Prefer to reply directly to the comment on the specific line of code rather than leaving general comments on the PR. This gives CodeRabbit more context when considering feedback, allowing it to create more specific learnings.

A generic comment on the PR might produce a vague learning. Replying to a specific line produces a learning tied to that file pattern and context.

## View learnings

To view the learnings that CodeRabbit has associated with your organization, follow these steps:

1. Visit [the CodeRabbit web interface](https://app.coderabbit.ai/settings/repositories).

2. In the sidebar, click **Learnings**.

This displays a paged list of all of the learnings associated with your organization, sorted by creation time, newest-first. To see more details about any learnings record, click its text.

### Filter displayed learnings

Over time, the learnings that CodeRabbit gathers for your organization can become quite numerous. This can make manually browsing the full list difficult. The CodeRabbit web interface has search and filtering tools to help you find specific learnings, based on the topic of the learning text, or on other metadata.

To filter the displayed learnings by topic or concept, enter that topic or concept into the **Similarity search** field, and set **Top K** to the number of results you want returned. Because this is a vector-based similarity search, the returned learnings don't necessarily contain the exact text of your search terms.

For example, to see the top ten learnings that have to do with error reporting, enter `error reporting` into **Similarity search** and set **Top K** to `10`. This will find learnings about exceptions, try-catch, error codes, and other semantically related topics.

To filter the displayed learnings by repository, user, or file path, click **+ Filters**, and select additional criteria.

### Edit or delete learnings

You can edit and delete learnings in two ways:

**Via the web interface**: If your account has the **Admin** [CodeRabbit role](/guides/roles) with your organization, then you can freely edit the text of any stored learning, or delete it outright through the CodeRabbit dashboard.

To edit or delete a learning via the web interface:

1. Click the **Action** menu on the learning record, which resembles three dots.

2. Select **Edit** or **Delete**.

**Via CodeRabbit comments**: Any user can request learning modifications through natural language comments in pull requests or issues. Ask CodeRabbit to remove or modify specific learnings by mentioning `@coderabbitai` and describing the change you want.

## Export and transfer learnings

You can export your organization's learnings and import them into another CodeRabbit account. This is useful when migrating accounts or consolidating organizations.

### Export learnings

To export your learnings:

1. Visit [the CodeRabbit web interface](https://app.coderabbit.ai).
2. Navigate to **Learnings** in the sidebar.
3. Click the export option to download your learnings as a CSV file.

The CSV file contains all your learnings with their associated metadata, including the repository, file path, and learning text.

### Import learnings to a new account

To import learnings into a new CodeRabbit account:

1. Ensure the new account is connected to your repository and has an active CodeRabbit subscription.

2. Add the exported learnings CSV file to a branch in your repository.

3. Create a pull request from that branch.

4. Use CodeRabbit chat to request the import:

```md  theme={null}
@coderabbitai import file my_learnings.csv as Learnings data for future use
```

CodeRabbit will process the CSV file and import your previous learnings into the new environment.

## Configure learnings storage and application

CodeRabbit has several configuration options that modify the storage and application of learnings.

### Opt out of learnings storage

CodeRabbit enables learnings by default. To disable learnings, modify one of the following configuration options:

* To disable all CodeRabbit [knowledge base](/integrations/knowledge-base) features for your organization or repository, which includes learnings, enable [the *Opt out* setting](/reference/configuration#opt-out).

* To disable all CodeRabbit features that require long-term data retention about your organization's use of CodeRabbit—including learnings—disable [the *Data retention* setting](/reference/configuration#data-retention).

<Warning>
  Disabling data retention immediately and irrevocably deletes all learnings
  that CodeRabbit has associated with your organization.
</Warning>

### Specify the scope of learnings

[The Learnings configuration setting](/reference/configuration#learnings) lets you specify the *scope* that CodeRabbit applies to all of the learnings it has collected about your organization. You can set this option to one of the following values:

* **`auto`** *(default)*: When reviewing a public repository, CodeRabbit applies only the learnings specific to that repository. When reviewing private repository, CodeRabbit applies all of your organization's learnings. This is the default setting.
* **`global`**: CodeRabbit applies all of your organization's learnings to all code reviews.
* **`local`**: CodeRabbit applies only learnings associated with code reviews' respective repositories.

### When to use each scope

The default `auto` scope can be suboptimal for organizations with diverse repositories. Consider these scenarios:

<AccordionGroup>
  <Accordion title="Use 'local' for diverse tech stacks">
    If your organization has repositories with different conventions—such as a
    Python backend and a React frontend—use `local` scope to prevent
    cross-contamination of learnings. Without `local` scope, learnings about
    Python exception handling might incorrectly influence React component
    reviews, or vice versa. `yaml # .coderabbit.yaml knowledge_base:
    		learnings: scope: "local" `
  </Accordion>

  <Accordion title="Use 'global' for consistent org-wide standards">
    If your organization maintains consistent coding standards across all
    repositories—such as security practices, documentation requirements, or
    naming conventions—use `global` scope to apply learnings universally.
    `yaml # .coderabbit.yaml knowledge_base: learnings: scope: "global" `
  </Accordion>

  <Accordion title="Use 'auto' for mixed visibility">
    The `auto` setting works well when you have both public and private
    repositories, and you want to: - Keep public repository learnings isolated -
    Share learnings across private repositories This is the default behavior and
    requires no configuration.
  </Accordion>
</AccordionGroup>

## Troubleshooting

### Learnings appear to not be working

If CodeRabbit seems to ignore your learnings—for example, continuing to make suggestions that contradict existing learnings—try this workaround:

1. **Review existing learnings.** Go to your project's Learnings page and verify that all relevant learnings are active and clearly phrased.

2. Consider possible conflicts with path instructions or coding guidelines. Path instructions precede learnings.

3. **Add a reinforcement rule.** Introduce a new rule that explicitly tells the model to stop and reconsider the Learnings before continuing the review. For example:

   ```
   “Before responding, review all Learnings to ensure none are ignored.”
   ```

4. **Save and re-test.** Commit this change and observe the next few automated reviews. CodeRabbit should now respect the learnings more consistently.

This situation can occur when the model deprioritizes certain learnings due to contextual overlap or conflicting instructions. The reinforcement rule prompts the model to stop and reassess learnings before proceeding.

### Maintaining learnings over time

Team conventions evolve, and learnings can become stale. To maintain learnings effectively:

* **Quarterly review.** Set a reminder to review your learnings every quarter. Look for learnings that reference deprecated patterns, old file structures, or outdated team decisions.
* **Delete contradictory learnings.** If you find learnings that conflict with current practices, delete them to avoid confusing CodeRabbit.
* **Update rather than accumulate.** When team standards change, update or delete old learnings rather than adding new ones that contradict them. Multiple conflicting learnings on the same topic can produce inconsistent behavior.

To identify outdated learnings:

1. Use the similarity search to find learnings about areas where your practices have changed.
2. Filter by creation date to find the oldest learnings.
3. Review learnings from team members who are no longer active.

## What's next

* [Add review instructions](/guides/review-instructions) for formal, path-based rules
* [Configure the knowledge base](/integrations/knowledge-base) for broader context integration
* [Set up issue tracking integration](/integrations/issue-integrations) for linked issue context


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Review instructions

> Add custom review instructions using path-based patterns or AST rules. Configure CodeRabbit to follow specific guidelines for different file types and enforce coding standards.

<CardGroup cols={3}>
  <Card title="Path-based instructions" icon="folder">
    **Covered in this guide**

    Add custom review instructions for specific file paths using glob patterns. Ideal for enforcing style guides by file types or directories.
  </Card>

  <Card title="Code guidelines" icon="book" href="/integrations/knowledge-base#code-guidelines:-automatic-team-rules">
    Create persistent coding standards and best practices that CodeRabbit learns from your codebase and applies consistently across reviews.
  </Card>

  <Card title="Learnings" icon="brain" href="/guides/learnings#about-coderabbit-learnings">
    Capture feedback from code review conversations to help CodeRabbit understand your team's preferences and coding patterns.
  </Card>
</CardGroup>

## Understanding the difference

<Warning>
  **Common confusion:** Path Instructions and Code Guidelines serve different
  purposes. Many users mistakenly put guideline file names in path\_instructions,
  which causes CodeRabbit to review the guideline files instead of using them as
  reference.
</Warning>

### Path Instructions vs. Code Guidelines

| Feature              | Path Instructions                            | Code Guidelines                                      |
| -------------------- | -------------------------------------------- | ---------------------------------------------------- |
| **Purpose**          | Tell CodeRabbit HOW to review specific files | Reference files containing your coding standards     |
| **Configuration**    | `.coderabbit.yaml` under `path_instructions` | Settings → Knowledge Base → Code Guidelines          |
| **What you provide** | Direct instructions as text                  | File paths/patterns to guideline documents           |
| **Example usage**    | "Check React code for hooks best practices"  | `CLAUDE.md`, `.cursorrules`, `CODING_STANDARDS.md`   |
| **Scope**            | Applies to files matching the path pattern   | Applies to files in same directory as guideline file |

### When to use each

**Use Path Instructions when:**

* You want CodeRabbit to focus on specific review aspects for certain file types
* You need different review strictness levels for different directories
* You want to enforce specific style guides or security checks by path

**Use Code Guidelines when:**

* You have existing guideline files (CLAUDE.md, .cursorrules, etc.)
* You want CodeRabbit to understand your team's coding standards
* You need consistent standards across AI tools (Cursor, Claude, etc.)

### Common mistake: Referencing guideline files in path\_instructions

<Accordion title="Example of incorrect configuration">
  ```yaml  theme={null}
  # ❌ WRONG: Don't do this
  path_instructions:
    - path: "mono/backend/CLAUDE.md"
      instructions: "Use this as coding guidelines"
  ```

  **What happens:** CodeRabbit tries to review the CLAUDE.md file itself, not use it as guidelines.

  **Correct approach:** Configure CLAUDE.md in Knowledge Base → Code Guidelines settings, or let CodeRabbit auto-detect it (enabled by default).
</Accordion>

### How Code Guidelines are scoped

<Info>
  Code guideline files are automatically scoped to their directory and subdirectories:

  * `mono/backend/CLAUDE.md` → applies to `mono/backend/**` files only
  * `mono/frontend/CLAUDE.md` → applies to `mono/frontend/**` files only
  * `documentation/guidelines/CODING_STANDARDS.md` → applies to `documentation/guidelines/**` files only

  This means guidelines in a documentation directory won't affect your code reviews unless the code files are in that same directory tree.
</Info>

## Path-based instructions

Add custom code review instructions for your entire project or specific file paths using glob patterns. Developers can provide tailored review guidelines based on file paths.

<Tip>
  Use path-based instructions when you want CodeRabbit to follow specific
  guidelines beyond standard reviews, such as enforcing style guides by file
  types or directories.
</Tip>

### Default blocked paths

By default, CodeRabbit blocks certain file paths and extensions from being reviewed. If you want CodeRabbit to review any of these blocked paths, you can explicitly include them in your Path Filters configuration.

<Accordion title="View complete list of default blocked paths">
  The following paths are blocked by default, grouped by category:

  #### Build and Dependency Directories

  | Path Pattern          | Description                |
  | --------------------- | -------------------------- |
  | `!**/dist/**`         | Build output directory     |
  | `!**/node_modules/**` | Node.js dependencies       |
  | `!**/.svelte-kit/**`  | SvelteKit build directory  |
  | `!**/.webpack/**`     | Webpack build directory    |
  | `!**/.yarn/**`        | Yarn cache directory       |
  | `!**/.docusaurus/**`  | Docusaurus build directory |
  | `!**/.temp/**`        | Temporary files directory  |
  | `!**/.cache/**`       | Cache directory            |
  | `!**/.next/**`        | Next.js build directory    |
  | `!**/.nuxt/**`        | Nuxt.js build directory    |

  #### Lock Files

  | Path Pattern            | Description        |
  | ----------------------- | ------------------ |
  | `!**/package-lock.json` | npm lock file      |
  | `!**/yarn.lock`         | Yarn lock file     |
  | `!**/pnpm-lock.yaml`    | pnpm lock file     |
  | `!**/bun.lockb`         | Bun lock file      |
  | `!**/*.lock`            | Generic lock files |

  #### Generated Code

  | Path Pattern           | Description                            |
  | ---------------------- | -------------------------------------- |
  | `!**/generated/**`     | Generated code directory               |
  | `!**/@generated/**`    | Generated code directory (alternative) |
  | `!**/__generated__/**` | Generated code directory (alternative) |
  | `!**/__generated/**`   | Generated code directory (alternative) |
  | `!**/_generated/**`    | Generated code directory (alternative) |
  | `!**/gen/**`           | Generated code directory (alternative) |
  | `!**/@gen/**`          | Generated code directory (alternative) |
  | `!**/__gen__/**`       | Generated code directory (alternative) |
  | `!**/__gen/**`         | Generated code directory (alternative) |
  | `!**/_gen/**`          | Generated code directory (alternative) |

  #### Binary and Compiled Files

  | Path Pattern  | Description             |
  | ------------- | ----------------------- |
  | `!**/*.app`   | Application bundle      |
  | `!**/*.bin`   | Binary file             |
  | `!**/*.class` | Java compiled class     |
  | `!**/*.dll`   | Windows dynamic library |
  | `!**/*.dylib` | macOS dynamic library   |
  | `!**/*.exe`   | Windows executable      |
  | `!**/*.o`     | Object file             |
  | `!**/*.so`    | Shared object file      |
  | `!**/*.wasm`  | WebAssembly file        |

  #### Archives and Compressed Files

  | Path Pattern | Description             |
  | ------------ | ----------------------- |
  | `!**/*.bz2`  | Bzip2 archive           |
  | `!**/*.gz`   | Gzip archive            |
  | `!**/*.xz`   | XZ archive              |
  | `!**/*.zip`  | ZIP archive             |
  | `!**/*.7z`   | 7-Zip archive           |
  | `!**/*.rar`  | RAR archive             |
  | `!**/*.zst`  | Zstandard archive       |
  | `!**/*.tar`  | TAR archive             |
  | `!**/*.jar`  | Java archive            |
  | `!**/*.war`  | Web application archive |
  | `!**/*.nar`  | NAR archive             |

  #### Media Files

  | Path Pattern | Description     |
  | ------------ | --------------- |
  | `!**/*.mp3`  | MP3 audio       |
  | `!**/*.wav`  | WAV audio       |
  | `!**/*.wma`  | WMA audio       |
  | `!**/*.mp4`  | MP4 video       |
  | `!**/*.avi`  | AVI video       |
  | `!**/*.mkv`  | MKV video       |
  | `!**/*.wmv`  | WMV video       |
  | `!**/*.m4a`  | M4A audio       |
  | `!**/*.m4v`  | M4V video       |
  | `!**/*.3gp`  | 3GP video       |
  | `!**/*.3g2`  | 3G2 video       |
  | `!**/*.rm`   | RealMedia video |
  | `!**/*.mov`  | QuickTime video |
  | `!**/*.flv`  | Flash video     |
  | `!**/*.swf`  | Flash animation |
  | `!**/*.flac` | FLAC audio      |
  | `!**/*.ogg`  | OGG audio       |

  #### Images and Fonts

  | Path Pattern  | Description            |
  | ------------- | ---------------------- |
  | `!**/*.ico`   | Icon file              |
  | `!**/*.svg`   | SVG image              |
  | `!**/*.jpeg`  | JPEG image             |
  | `!**/*.jpg`   | JPEG image             |
  | `!**/*.png`   | PNG image              |
  | `!**/*.gif`   | GIF image              |
  | `!**/*.bmp`   | BMP image              |
  | `!**/*.tiff`  | TIFF image             |
  | `!**/*.webm`  | WebM image             |
  | `!**/*.ttf`   | TrueType font          |
  | `!**/*.otf`   | OpenType font          |
  | `!**/*.woff`  | Web Open Font Format   |
  | `!**/*.woff2` | Web Open Font Format 2 |
  | `!**/*.eot`   | Embedded OpenType font |

  #### Documents and Data Files

  | Path Pattern    | Description             |
  | --------------- | ----------------------- |
  | `!**/*.pdf`     | PDF document            |
  | `!**/*.doc`     | Word document           |
  | `!**/*.docx`    | Word document           |
  | `!**/*.xls`     | Excel spreadsheet       |
  | `!**/*.xlsx`    | Excel spreadsheet       |
  | `!**/*.ppt`     | PowerPoint presentation |
  | `!**/*.pptx`    | PowerPoint presentation |
  | `!**/*.csv`     | CSV data file           |
  | `!**/*.tsv`     | TSV data file           |
  | `!**/*.dat`     | Data file               |
  | `!**/*.db`      | Database file           |
  | `!**/*.parquet` | Parquet data file       |

  #### Development and System Files

  | Path Pattern         | Description         |
  | -------------------- | ------------------- |
  | `!**/tags`           | Tags file           |
  | `!**/.tags`          | Tags file           |
  | `!**/TAGS`           | Tags file           |
  | `!**/.TAGS`          | Tags file           |
  | `!**/.DS_Store`      | macOS system file   |
  | `!**/.cscope.files`  | Cscope files        |
  | `!**/.cscope.out`    | Cscope output       |
  | `!**/.cscope.in.out` | Cscope input/output |
  | `!**/.cscope.po.out` | Cscope output       |
  | `!**/*.log`          | Log file            |
  | `!**/*.map`          | Source map          |
  | `!**/*.out`          | Output file         |
  | `!**/*.sum`          | Checksum file       |
  | `!**/*.work`         | Work file           |
  | `!**/*.md5sum`       | MD5 checksum file   |

  #### Game and 3D Assets

  | Path Pattern        | Description            |
  | ------------------- | ---------------------- |
  | `!**/*.tga`         | Targa image            |
  | `!**/*.dds`         | DirectDraw surface     |
  | `!**/*.psd`         | Photoshop document     |
  | `!**/*.fbx`         | FBX 3D model           |
  | `!**/*.obj`         | OBJ 3D model           |
  | `!**/*.blend`       | Blender file           |
  | `!**/*.dae`         | COLLADA 3D model       |
  | `!**/*.gltf`        | GL Transmission Format |
  | `!**/*.hlsl`        | HLSL shader            |
  | `!**/*.glsl`        | GLSL shader            |
  | `!**/*.unity`       | Unity scene            |
  | `!**/*.umap`        | Unreal map             |
  | `!**/*.prefab`      | Unity prefab           |
  | `!**/*.mat`         | Material file          |
  | `!**/*.shader`      | Shader file            |
  | `!**/*.shadergraph` | Shader graph           |
  | `!**/*.sav`         | Save file              |
  | `!**/*.scene`       | Scene file             |
  | `!**/*.asset`       | Asset file             |

  #### Python-specific Files

  | Path Pattern   | Description           |
  | -------------- | --------------------- |
  | `!**/*.pyc`    | Python compiled file  |
  | `!**/*.pyd`    | Python dynamic module |
  | `!**/*.pyo`    | Python optimized file |
  | `!**/*.pkl`    | Python pickle file    |
  | `!**/*.pickle` | Python pickle file    |

  #### Go-specific Files

  | Path Pattern     | Description                     |
  | ---------------- | ------------------------------- |
  | `!**/*.pb.go`    | Protocol buffer Go file         |
  | `!**/*.pb.gw.go` | Protocol buffer gateway Go file |

  #### Terraform Files

  | Path Pattern           | Description            |
  | ---------------------- | ---------------------- |
  | `!**/*.tfstate`        | Terraform state file   |
  | `!**/*.tfstate.backup` | Terraform state backup |

  #### Minified Files

  | Path Pattern       | Description                    |
  | ------------------ | ------------------------------ |
  | `!**/*.min.js`     | Minified JavaScript            |
  | `!**/*.min.js.map` | Minified JavaScript source map |
  | `!**/*.min.js.css` | Minified CSS                   |
</Accordion>

### Configure path filters

You can edit your path filters directly in the UI:

<Steps>
  <Step title="Navigate to settings">
    Go to **Configuration** > **Review** > **Settings** > **Path Filters**
  </Step>

  <Step title="Modify filters">Add or remove path patterns as needed</Step>
</Steps>

<img src="https://mintcdn.com/coderabbit/69LGK0BhaHIxrC15/images/guides/img/guides/path-filters.png?fit=max&auto=format&n=69LGK0BhaHIxrC15&q=85&s=c45b14a62b428d2fa7a691266c54287c" alt="Path Filters Configuration" data-og-width="1155" width="1155" data-og-height="412" height="412" data-path="images/guides/img/guides/path-filters.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/coderabbit/69LGK0BhaHIxrC15/images/guides/img/guides/path-filters.png?w=280&fit=max&auto=format&n=69LGK0BhaHIxrC15&q=85&s=bf75677a7a2be7d50a38f0a197aaa420 280w, https://mintcdn.com/coderabbit/69LGK0BhaHIxrC15/images/guides/img/guides/path-filters.png?w=560&fit=max&auto=format&n=69LGK0BhaHIxrC15&q=85&s=2070d50d9bdcb3275263af307ab183a0 560w, https://mintcdn.com/coderabbit/69LGK0BhaHIxrC15/images/guides/img/guides/path-filters.png?w=840&fit=max&auto=format&n=69LGK0BhaHIxrC15&q=85&s=33bbf9b36263f9c28631cf46887e3342 840w, https://mintcdn.com/coderabbit/69LGK0BhaHIxrC15/images/guides/img/guides/path-filters.png?w=1100&fit=max&auto=format&n=69LGK0BhaHIxrC15&q=85&s=20e89334b3a6dbb4d7dee556f387e5c0 1100w, https://mintcdn.com/coderabbit/69LGK0BhaHIxrC15/images/guides/img/guides/path-filters.png?w=1650&fit=max&auto=format&n=69LGK0BhaHIxrC15&q=85&s=5f5541d9c782204ba7fa7c2ce740ac0e 1650w, https://mintcdn.com/coderabbit/69LGK0BhaHIxrC15/images/guides/img/guides/path-filters.png?w=2500&fit=max&auto=format&n=69LGK0BhaHIxrC15&q=85&s=4b02797abbb021fe5fb37d1d1b508d2f 2500w" />

### Sample usage

<Note>
  Paths accept glob patterns. See the
  [minimatch](https://github.com/isaacs/minimatch) documentation for more
  information.
</Note>

```yaml YAML lines wrap icon="code" theme={null}
#...
reviews:
  #...
  path_instructions:
    - path: "**/*.js"
      instructions: |
        Review the JavaScript code against the Google JavaScript style guide and point out any mismatches
    - path: "tests/**.*"
      instructions: |
        Review the following unit test code written using the Mocha test library. Ensure that:
        - The code adheres to best practices associated with Mocha.
        - Descriptive test names are used to clearly convey the intent of each test.
```

## Abstract Syntax Tree (AST) based instructions

<Info>
  This feature is available exclusively as part of the Pro plan and is not
  included in the Lite plan. Please refer to our [pricing
  page](https://www.coderabbit.ai/pricing) for more information about our plans
  and features.
</Info>

CodeRabbit offers review instructions based on Abstract Syntax Tree (AST) patterns. Under the hood, CodeRabbit uses [`ast-grep`](https://ast-grep.github.io) to power this feature.

<Card title="ast-grep" icon="code">
  `ast-grep` is written in Rust and uses the tree-sitter parser to generate the
  AST for popular languages. Written and maintained by [Herrington
  Darkholme](https://twitter.com/hd_nvim).
</Card>

<Check>
  `ast-grep` Playground is quite effective in designing and testing AST rules on
  source code snippets. You can access the playground
  [here](https://ast-grep.github.io/playground.html).
</Check>

<Note>
  The additional context provided by this feature is only available during the automated code review process, and it's not available in the chat.

  Moreover, this feature is only recommended for advanced users as there is a learning curve involved.
</Note>

<Note>
  **Deep dive into AST patterns and `ast-grep` rules**

  * Abstract Syntax Tree (AST) [Wikipedia article](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
  * `ast-grep` [official documentation](https://ast-grep.github.io/guide/rule-config.html) for detailed guides.
</Note>

This section explains how to add custom code review instructions using `ast-grep` rules for searching code using abstract syntax trees (AST) patterns.

### Setup process

<Steps>
  <Step title="Create rules directory">
    Create a directory to keep all the `ast-grep` rules in your project
    directory
  </Step>

  <Step title="Add rule files">
    Add individual `.yaml` files for each `ast-grep` rule within the newly
    created directory
  </Step>

  <Step title="Configure rules">
    Ensure that each `.yaml` file contains the necessary `ast-grep` rule
    configurations
  </Step>

  <Step title="Add message property">
    Ensure that all rules contain a `message` property that will be used during
    the review process
  </Step>

  <Step title="Update configuration">
    Add the rules' directory to the `.coderabbit.yml` file under
    `tools.ast-grep` configuration
  </Step>

  <Step title="Add packages (optional)">
    Optionally, add `packages` property to specify packages that should be
    installed before running the `ast-grep` tool
  </Step>
</Steps>

```yaml YAML lines wrap icon="code" theme={null}
#...
reviews:
  #...
  tools:
    ast-grep:
      essential_rules: true # option to enable essential security rules
      rule_dirs:
        - "custom-name"
      packages:
        - "myorg/myawesomepackage" # custom package name following the format organization/repository
  #...
```

### The rule object

Rule object is the core concept of `ast-grep` rule system and every other feature is built on top of it.

Below is the full list of fields in a rule object. Every rule field is optional and can be omitted, but at least one field should be present in a rule. A node will match a rule if and only if it satisfies all fields in the rule object.

```yaml YAML lines wrap icon="code" theme={null}
rule:
  # atomic rule
  pattern: "search.pattern"
  kind: "tree_sitter_node_kind"
  regex: "rust|regex"
  # relational rule
  inside: { pattern: "sub.rule" }
  has: { kind: "sub_rule" }
  follows: { regex: "can|use|any" }
  precedes: { kind: "multi_keys", pattern: "in.sub" }
  # composite rule
  all: [{ pattern: "match.all" }, { kind: "match_all" }]
  any: [{ pattern: "match.any" }, { kind: "match_any" }]
  not: { pattern: "not.this" }
  matches: "utility-rule"
```

### Rule categories

The rule object fields can be categorized into three types:

<CardGroup cols={3}>
  <Card title="Atomic Rule" icon="atom">
    The most basic rule that checks if AST nodes match
  </Card>

  <Card title="Relational Rule" icon="link">
    Rules that check if a node is surrounded by another node
  </Card>

  <Card title="Composite Rule" icon="puzzle">
    Rules that combine sub-rules together using logical operators
  </Card>
</CardGroup>

These three categories of rules can be composed together to create more complex rules.

<Tip>
  The rule object is inspired by CSS selectors but with more composability and
  expressiveness. Thinking about how selectors in CSS work can help you
  understand the rule object!
</Tip>

> Read `ast-grep` > [documentation](https://ast-grep.github.io/guide/rule-config.html) for detailed guides.

#### Atomic rule

Atomic rule defines the most basic matching rule that determines whether one syntax node matches the rule or not. There are three kinds of atomic rule: `pattern`, `kind` and `regex`.

> Official documentation guide on [Atomic Rule](https://ast-grep.github.io/guide/rule-config/atomic-rule.html)

#### Relational rule

A relational rule defines the relationship between two syntax nodes. There are four kinds of relational rule: `inside`, `has`, `follows` and `precedes`.

All four relational rules accept a sub-rule object as their value. The sub-rule will match the surrounding node, while the relational rule itself will match the target node.

> Official documentation guide on [Relational Rule](https://ast-grep.github.io/guide/rule-config/relational-rule.html)

```yaml YAML lines wrap icon="code" theme={null}
rule:
  pattern: await $PROMISE
  inside:
    kind: for_in_statement
    stopBy: end
```

#### Composite rule

A composite rule defines the logical relationship between multiple sub-rules. There are three kinds of composite rule: `all`, `any` and `not`.

**`all`**

The `all` rule matches if all sub-rules match.

```yaml YAML lines wrap icon="code" theme={null}
rule:
  all:
    - pattern: console.log('Hello World');
    - kind: expression_statement
```

**`any`**

`any` rule matches if any sub-rule matches.

```yaml YAML lines wrap icon="code" theme={null}
rule:
  any:
    - pattern: var a = $A
    - pattern: const a = $A
    - pattern: let a = $A
```

**`not`**

`not` applies negation to a sub-rule. It matches if the sub-rule does not match.

```yaml YAML lines wrap icon="code" theme={null}
rule:
  pattern: console.log($GREETING)
  not:
    pattern: console.log('Hello World')
```

> Official documentation guide on [Composite Rule](https://ast-grep.github.io/guide/rule-config/composite-rule.html)

### Reusing rule as utility

`ast-grep` chooses to use YAML for rule representation. While this decision makes writing rules easier, it does impose some limitations on the rule authoring. One of the limitations is that rule objects cannot be reused.

#### Local utility rule

Local utility rules are defined in the utils field of the config file. Utils is a string-keyed dictionary.

For example, the following config file defines a local utility rule `is-literal`:

```yaml YAML lines wrap icon="code" theme={null}
utils:
  is-literal:
    any:
      - kind: string
      - kind: number
      - kind: boolean
rule:
  matches: is-literal
```

#### Global utility rule

Global utility rules are defined in a separate file. But they are available across all rule configurations in the project.

To create global utility rules, you need to have the `rules` directory created on the root of your project and another `utils` directory inside the root of your project.

```yaml YAML lines wrap icon="code" theme={null}
my-awesome-project   # project root
  |- rules           # rule directory
  | |- my-rule.yml
  |- utils           # utils directory
  | |- is-literal.yml
```

> Also, you need to add the `rules` and `utils` directories to the `.coderabbit.yml` file under `tools.ast-grep` configuration. The rules can also be inside a package. If you have a package that contains rules, you can add the package name to the `packages` field in the `.coderabbit.yml` file.

```yaml YAML lines wrap icon="code" theme={null}
#...
reviews:
  #...
  tools:
    ast-grep:
      essential_rules: true
      rule_dirs:
        - "rules"
      util_dirs:
        - "utils"
      packages:
        - "my-awesome-org/my-awesome-package" # public repository that contains ast-grep rules
  #...
```

```yaml YAML lines wrap icon="code" theme={null}
# is-literal.yml
id: is-literal
language: TypeScript
rule:
  any:
    - kind: "false"
    - kind: undefined
    - kind: "null"
    - kind: "true"
    - kind: regex
    - kind: number
    - kind: string
```

> Official documentation guide on [Utility Rule](https://ast-grep.github.io/guide/rule-config/utility-rule.html)

### Packages

A package allows you to share rules across multiple projects. Essentially, a package is a collection of `ast-grep` rules.

<CardGroup cols={2}>
  <Card title="Built-in packages" icon="package">
    CodeRabbit provides packages you can use out of the box
  </Card>

  <Card title="Custom packages" icon="box">
    Create your own packages and share them with your community or organization
  </Card>
</CardGroup>

#### CodeRabbit packages

<Card title="ast-grep-essentials" icon="shield" href="https://github.com/coderabbitai/ast-grep-essentials">
  **Essential security rules package**

  Because we value security, this package gets its own property in the `.coderabbit.yml` file for easier installation without overwriting existing configurations.
</Card>

To use a package, you need to add the package name to the `packages` field in the `.coderabbit.yml` file.

```yaml YAML lines wrap icon="code" theme={null}
#...
reviews:
  #...
  tools:
    ast-grep:
      essential_rules: true
      packages: # list of packages to install, in future coderabbit will provide a set of packages, beside the essentials one.
        - "my-awesome-org/my-awesome-package" # custom package name following the format organization/repository
  #...
```

#### Using custom package

Let's say that you have a public repository that contains `ast-grep` rules. You can add the package name to the `packages` field in the `.coderabbit.yml` file.

#### Package requirements

<AccordionGroup>
  <Accordion title="Repository requirements">
    * Must be a public repository
    * Name should be in the format `organization/repository`
  </Accordion>

  <Accordion title="Content requirements">
    * Contains rules that follow the `ast-grep` rule format
    * Follows the required folder structure shown below
  </Accordion>

  <Accordion title="Folder structure">
    ```text  theme={null}
    my-awesome-project   # project root
      |- rules           # rule directory
      | |- my-rule.yml
      |- utils           # utils directory
      | |- is-literal.yml
    ```

    <Note>
      `rules` and `utils` directories are keywords and must be named exactly as shown. Inside each directory, the structure is flexible. You can have other root directories or files as needed.
    </Note>
  </Accordion>
</AccordionGroup>

```yaml YAML lines wrap icon="code" theme={null}
#...
reviews:
  #...
  tools:
    ast-grep:
      packages:
        - "my-awesome-org/my-awesome-package"
  #...
```

### Multiple languages support

CodeRabbit supports multiple programming languages for defining `ast-grep` rules:

<CardGroup cols={3}>
  <Card title="Web Technologies" icon="globe">
    * JavaScript
    * TypeScript
  </Card>

  <Card title="Systems Languages" icon="microchip">
    * C
    * Rust
    * Golang
  </Card>

  <Card title="Enterprise Languages" icon="building">
    * Java
    * C#
    * Kotlin
    * Python
  </Card>
</CardGroup>

### Language examples

Below are examples of `ast-grep` rules in different languages:

#### JavaScript

##### Importing files without an extension is not allowed

```yaml YAML lines wrap icon="code" theme={null}
id: find-import-file
language: js
message: "Importing files without an extension is not allowed"
rule:
  regex: "/[^.]+[^/]$"
  kind: string_fragment
  any:
    - inside:
        stopBy: end
        kind: import_statement
    - inside:
        stopBy: end
        kind: call_expression
        has:
          field: function
          regex: "^import$"
```

##### No console.log allowed except `console.error` on the catch block

```yaml YAML lines wrap icon="code" theme={null}
id: no-console-except-error
language: typescript
message: "No console.log allowed except console.error on the catch block"
rule:
  any:
    - pattern: console.error($$$)
      not:
        inside:
          kind: catch_clause
          stopBy: end
    - pattern: console.$METHOD($$$)
constraints:
  METHOD:
    regex: "log|debug|warn"
```

#### C

In C, there is no built-in support for object-oriented programming, but some programmers use structs and function pointers to simulate classes and methods.

However, this style can have some drawbacks, such as:

* Extra memory allocation and reallocation for the struct and the function pointer.
* Indirection overhead when calling the function pointer.

A possible alternative is to use a plain function call with the struct pointer as the first argument.

```yaml YAML lines wrap icon="code" theme={null}
id: method_receiver
language: c
rule:
  pattern: $R.$METHOD($$$ARGS)
transform:
  MAYBE_COMMA:
    replace:
      source: $$$ARGS
      replace: "^.+"
      by: ", "
fix: $METHOD(&$R$MAYBE_COMMA$$$ARGS)
```


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Integrate MCP servers

> Connect CodeRabbit to external tools and data sources through the Model Context Protocol (MCP) for enhanced code reviews with richer contextual understanding.

<Note>MCP integrations is a Pro feature in Beta.</Note>

Connect CodeRabbit to external tools and data sources through the Model Context Protocol (MCP) integration. This allows CodeRabbit to serve as the MCP client and provides richer contextual understanding for enhanced code reviews.

## What MCP integration enables

<CardGroup cols={3}>
  <Card title="Code reviews">
    Enhanced analysis with external context and documentation
  </Card>

  <Card title="Code suggestions">
    Improved validation using your organization's knowledge
  </Card>

  <Card title="PR chat">
    Access to relevant documentation and project information
  </Card>
</CardGroup>

## Supported integrations

Access your documentation, project management tools, knowledge bases, Figma designs, and more through MCP servers.

## Considerations

<CardGroup cols={1}>
  <Card>
    <Info>
      **CodeRabbit as MCP client**: CodeRabbit acts as the MCP client, not the
      server. It ingests data from your connected MCP servers.
    </Info>

    <Warning>
      **Data relevance**: Consider what MCP data will be helpful for code
      reviews. CodeRabbit uses this data for analysis, validation, and chat
      interactions.
    </Warning>

    <Tip>
      **Faster integrations**: This approach unlocks integrations without
      waiting for formal CodeRabbit support. If a tool has an MCP server,
      CodeRabbit can connect to it.
    </Tip>
  </Card>
</CardGroup>

## Setup

<Steps>
  <Step title="Navigate to integrations">
    Go to the Integrations page within your CodeRabbit app settings and select
    the **MCP Server** tab.
  </Step>

  <Step title="Add MCP integration">
    Click **Add MCP Integration** and provide your server connection details
    along with a descriptive name.
  </Step>

  <Step title="Complete authentication">
    Complete the authentication process for your MCP server following the
    prompts.
  </Step>

  <Step title="Configure tools">
    Enable or disable individual MCP tools for each server based on your needs.
  </Step>
</Steps>

## How it works

<Tabs>
  <Tab title="During code reviews">
    CodeRabbit automatically calls relevant MCP tools during analysis to:

    <CardGroup cols={2}>
      <Card title="Gather context">
        Collects additional review context from your connected data sources
      </Card>

      <Card title="Enhance comments">
        Validates and enriches suggested review comments with relevant information
      </Card>
    </CardGroup>

    <Info>
      Enhanced review comments will include enriched insights while maintaining your existing workflow. Tools used during analysis are listed under **"Additional context used."**
    </Info>
  </Tab>

  <Tab title="In chat interactions">
    MCP integration enhances chat by providing access to:

    <CardGroup cols={2}>
      <Card title="Contextual information">
        Retrieves relevant information based on discussion topics
      </Card>

      <Card title="External documentation">
        Accesses your organization's knowledge bases and documentation
      </Card>
    </CardGroup>
  </Tab>
</Tabs>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Username-based PR review control

> Automatically skip reviews for pull requests from specific users like bots, service accounts, or team members by adding usernames to your configuration.

Automatically skip reviews for pull requests from specific users. Add Git platform usernames to your configuration and CodeRabbit will silently skip reviews for those users without posting comments.

<Tabs>
  <Tab title="Skip bot PRs">
    <Card icon="bot-message-square">
      Exclude dependency bots and automated updates from reviews

      ```yaml  theme={null}
      ignore_usernames: ["dependabot[bot]", "renovate[bot]"]
      ```
    </Card>
  </Tab>

  <Tab title="Skip service accounts">
    <Card icon="cog">
      Bypass reviews for CI/CD and automation accounts

      ```yaml  theme={null}
      ignore_usernames: ["ci-automation", "release-bot"]
      ```
    </Card>
  </Tab>

  <Tab title="Skip team members">
    <Card icon="users">
      Exclude trusted contributors who self-review

      ```yaml  theme={null}
      ignore_usernames: ["senior-dev", "tech-lead"]
      ```
    </Card>
  </Tab>

  <Tab title="Mixed configuration">
    <Card icon="list">
      Combine different user types in one list

      ```yaml  theme={null}
      ignore_usernames: ["dependabot[bot]", "ci-bot", "trusted-dev"]
      ```
    </Card>
  </Tab>
</Tabs>

## How it works

<Steps>
  <Step title="Check PR author">
    CodeRabbit checks if the PR author's username matches any in your
    `ignore_usernames` list
  </Step>

  <Step title="Skip if matched">
    If the username matches exactly (case-sensitive), the review is skipped
    silently
  </Step>

  <Step title="Continue if not matched">
    If no match, CodeRabbit continues with normal review processing, including
    label checks
  </Step>

  <Step title="Manual override available">
    Use `@coderabbitai review` to force a review even for ignored users
  </Step>
</Steps>

## Configuration

Add the `ignore_usernames` array to your `.coderabbit.yaml` file:

```yaml  theme={null}
reviews:
  auto_review:
    ignore_usernames:
      [
        "dependabot[bot]",
        "renovate[bot]",
        "github-actions[bot]",
        "ci-automation",
      ]
```

<Warning>
  **Username matching is exact and case-sensitive**. Verify the exact username
  format on your Git platform. For example, GitHub bots use `[bot]` suffix.
</Warning>

<Tabs>
  <Tab title="Review decisions">
    | Configuration        | PR Author  | Review Status | Comment Posted      |
    | :------------------- | :--------- | :------------ | :------------------ |
    | `[]` (empty)         | Any user   | ✅ Reviewed    | Yes (if applicable) |
    | `["bot-user"]`       | bot-user   | ❌ Skipped     | No (silent skip)    |
    | `["bot-user"]`       | other-user | ✅ Reviewed    | Yes (if applicable) |
    | `["user1", "user2"]` | user1      | ❌ Skipped     | No (silent skip)    |
    | `["User1"]`          | user1      | ✅ Reviewed    | Yes (case mismatch) |
  </Tab>

  <Tab title="Edge cases">
    | Scenario       | Configuration        | Result     | Notes                            |
    | :------------- | :------------------- | :--------- | :------------------------------- |
    | Whitespace     | `[" user1 "]`        | ❌ Skipped  | Whitespace trimmed automatically |
    | Empty string   | `[""]`               | ✅ Reviewed | Empty strings filtered out       |
    | Email format   | `["user@email.com"]` | ✅ Reviewed | Must use username, not email     |
    | Missing config | `null` or missing    | ✅ Reviewed | Defaults to empty array          |
  </Tab>
</Tabs>

## Integration with other features

Username-based skipping takes precedence over other controls:

<Info>
  **Processing order**: Username check → Label check → Other review rules

  If a user is in `ignore_usernames`, their PR is skipped regardless of labels or other settings.
</Info>

### Migration from labels only

```yaml  theme={null}
# Before: Using only labels
reviews:
  auto_review:
    labels: ["!wip", "!draft"]

# After: Adding username filtering
reviews:
  auto_review:
    labels: ["!wip", "!draft"]
    ignore_usernames: [
      "dependabot[bot]",
      "renovate[bot]"
    ]
```

### Manual review override

Even for ignored users, you can trigger reviews manually:

```md  theme={null}
@coderabbitai review
```

This command overrides the username ignore setting for that specific PR.

## Best practices

<Accordion title="Use for permanent exclusions">
  Username-based ignoring works best for users you want to permanently exclude:

  * Automated bots (dependency updates, security scanners)
  * Service accounts (CI/CD, deployment automation)
  * Trusted senior developers who consistently self-review

  For temporary exclusions, use labels like `wip` or `draft` instead.
</Accordion>

<Accordion title="Verify exact usernames">
  Username matching is strict. Check the exact format on your platform:

  * **GitHub**: `dependabot[bot]`, `renovate[bot]`, `github-actions[bot]`
  * **GitLab**: `gitlab-ci-token`, `project_123_bot`
  * **Azure DevOps**: Service account names without special formatting

  Copy usernames directly from PR author fields to avoid typos.
</Accordion>

<Accordion title="Document your choices">
  Maintain a list of ignored users and reasons:

  ```yaml  theme={null}
  # Bot accounts for dependency management
  ignore_usernames: [
      "dependabot[bot]", # Automated dependency updates
      "renovate[bot]", # Alternative dependency updates
      "snyk-bot", # Security vulnerability fixes
    ]
  ```
</Accordion>

<Accordion title="Regular review">
  Periodically review your ignore list: - Remove accounts that are no longer
  active - Add new automation accounts as they're created - Verify usernames are
  still accurate after platform changes
</Accordion>

## Limitations

* **No wildcard support**: Cannot use patterns like `*[bot]` or `dependabot*`
* **No regex support**: Must specify exact usernames
* **Case-sensitive matching**: `User1` and `user1` are treated as different users
* **Platform-specific formats**: Username formats vary between Git platforms
* **No team/group support**: Cannot ignore entire teams or organizations

## Troubleshooting

### PR still being reviewed

**Problem**: A user in your ignore list is still getting reviews.

**Solutions**:

1. **Check exact username**: Copy the username directly from the PR author field
2. **Verify case matching**: Ensure capitalization matches exactly
3. **Check configuration syntax**: Confirm YAML array format is correct
4. **Validate configuration deployment**: Ensure `.coderabbit.yaml` changes are committed

### Want to review an ignored user's PR

**Problem**: Need to review a PR from someone on your ignore list.

**Solutions**:

1. **Use manual review**: Comment `@coderabbitai review` on the PR
2. **Temporary removal**: Remove username from ignore list, commit, then re-add
3. **Use labels**: For occasional reviews, consider label-based controls instead

## Commit status

When a PR is skipped due to username filtering:

* **Status message**: "Review skipped: Author is ignored by configuration"
* **No summary comment**: The skip is silent to avoid noise
* **Logged for debugging**: The skip reason is recorded for troubleshooting


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Linters & security analysis tools

> Integrate 40+ third-party tools like ESLint, Ruff, and Gitleaks into CodeRabbit reviews for enhanced code quality and 1-click fixes.

CodeRabbit integrates with 40+ third-party linters and security analysis tools to enhance your code reviews. These tools run automatically in secure sandboxed environments, providing detailed feedback and 1-click fixes for common issues.

<Info>
  **Pro plan required** - This feature is available exclusively with CodeRabbit
  Pro. See our [pricing page](https://www.coderabbit.ai/pricing) for plan
  details.
</Info>

## Tool categories

<CardGroup cols={3}>
  <Card title="Code quality" icon="code" href="/tools/list">
    ESLint, Ruff, Pylint, SwiftLint, and 20+ more linters for code standards
  </Card>

  <Card title="Security analysis" icon="shield-check" href="/tools/list">
    Gitleaks, Semgrep, Checkov, and Brakeman for vulnerability detection
  </Card>

  <Card title="CI/CD integration" icon="cog" href="/tools/list">
    Pipeline remediation for GitHub Actions, CircleCI, and Azure DevOps
  </Card>
</CardGroup>

## Configuration methods

<Tabs>
  <Tab title="YAML configuration">
    Add tools to your repository's `.coderabbit.yaml` file:

    ```yaml YAML lines wrap icon="code" theme={null}
    reviews:
      profile: assertive
      tools:
        eslint:
          enabled: true
        ruff:
          enabled: true
          config_file: "pyproject.toml"
        gitleaks:
          enabled: true
    ```
  </Tab>

  <Tab title="Settings page">
    Configure tools through CodeRabbit's web interface:

    1. Navigate to **Review → Tools** in your settings
    2. Toggle individual tools on/off
    3. Set **Review → Profile** to `Chill` or `Assertive`
    4. Save changes to apply across all repositories
  </Tab>
</Tabs>

## Tool profiles

CodeRabbit offers two review profiles that control tool strictness:

* `Chill`: Focuses on critical issues and reduces noise from minor style violations
* `Assertive`: Provides comprehensive feedback including style and best practice suggestions

Each tool respects your existing configuration files (like `.eslintrc.js` or `pyproject.toml`) for maximum customization.

## Tool output and fixes

When tools detect issues, CodeRabbit displays structured output in the review comments:

```shell lines wrap icon="code" theme={null}
ESLint
src/components/Button.tsx
12-12: 'React' must be in scope when using JSX

Add React import statement

(react/react-in-jsx-scope)
```

Many tools provide 1-click fixes that CodeRabbit can apply directly to your pull request, streamlining the review process.

## Language support

Popular languages and their supported tools:

* **JavaScript/TypeScript**: Biome, ESLint, oxlint
* **Python**: Ruff, Pylint, Flake8
* **Go**: golangci-lint
* **Rust**: Clippy
* **Ruby**: RuboCop, Brakeman
* **Swift**: SwiftLint
* **PHP**: PHPStan, PHPMD, PHPCS

For the complete list of 40+ supported tools, see [supported tools](/tools/list).

## What's next

<CardGroup cols={2}>
  <Card title="Browse all tools" href="/tools/list">
    Complete list of linters, security tools, and CI/CD integrations
  </Card>

  <Card title="YAML configuration" href="/reference/configuration#reference">
    Full reference for .coderabbit.yaml configuration options
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Issue trackers

> CodeRabbit integrates with popular issue tracking systems to provide context from linked and related issues while reviewing code.

<Info>
  This feature is available exclusively as part of the Pro plan and is not
  included in the Lite plan. Please refer to our [pricing
  page](https://www.coderabbit.ai/pricing) for more information about our plans
  and features.
</Info>

## Jira

### Enable Jira Integration

1. Navigate to [integrations](https://app.coderabbit.ai/integrations?tab=integrations) in the CodeRabbit app.
2. Toggle the Jira switch to enable the integration.

Upon enabling the Jira integration, CodeRabbit will redirect you to the Jira login page. Enter your Jira credentials to authenticate the integration.

### CodeRabbit Configuration

Now we need to configure the repository to work with the Jira and add Jira's Project Keys. The project key is a short project identifier, for example in `https://company.atlassian.net/browse/PROJ-123`, the key is `PROJ`.

<Tabs>
  <Tab title="Using .coderabbit.yaml">
    ```yaml  theme={null}
    knowledge_base:
    	jira:
    		usage: enabled
    		team_keys: ["PROJ"]

    chat:
    	integrations:
    		jira:
    			usage: enabled
    ```
  </Tab>

  <Tab title="Using Web Interface">
        <img src="https://mintlify.s3.us-west-1.amazonaws.com/coderabbit/integrations/images/assets/images/jira-integration-setup.png" alt="Jira configuration" />
  </Tab>
</Tabs>

<Note>
  By default, Jira integration is enabled for private repositories and disabled
  for public repositories. You can override this behavior by setting
  `knowledge_base.jira.usage: enabled` and `chat.integrations.jira.usage:
  	enabled` in your `.coderabbit.yaml` file or using web interface. See
  [Configuration reference](/reference/configuration) for details.
</Note>

### Example Usage

* You can link an issue to your pull request, allowing CodeRabbit to assess whether your changes satisfy the issue's requirements. To link a Jira Issue, you can add the Jira Issue into the PR description: `Closes https://company.atlassian.net/browse/PROJ-123`. See [Linked Issues](/guides/linked-issues) for details.
* You can also create new Jira issues directly through CodeRabbit. See our [Issue Creation guide](/guides/issue-creation#jira) for details.

## Linear

### Enable Linear Integration

1. Navigate to [integrations](https://app.coderabbit.ai/integrations?tab=integrations) in the CodeRabbit app.
2. Toggle the Linear switch to enable the integration.

Upon enabling the Linear integration, CodeRabbit will redirect you to the Linear login page. Enter your Linear credentials to authenticate the integration.

### CodeRabbit Configuration

Now we need to configure the repository to work with Linear and add Linear's Team Keys. The team key is a short team identifier, for example in `https://linear.app/company/issue/DEV-123`, the key is `DEV`.

<Tabs>
  <Tab title="Using .coderabbit.yaml">
    ```yaml  theme={null}
    knowledge_base:
    	linear:
    		usage: enabled
    		team_keys: ["DEV"]

    chat:
    	integrations:
    		linear:
    			usage: enabled
    ```
  </Tab>

  <Tab title="Using Web Interface">
        <img src="https://mintlify.s3.us-west-1.amazonaws.com/coderabbit/integrations/images/assets/images/linear-integration-setup.png" alt="Linear configuration" />
  </Tab>
</Tabs>

<Note>
  By default, Linear integration is enabled for private repositories and
  disabled for public repositories. You can override this behavior by setting
  `knowledge_base.linear.usage: enabled` and `chat.integrations.linear.usage:
  	enabled` in your `.coderabbit.yaml` file or using web interface. See
  [Configuration reference](/reference/configuration) for details.
</Note>

### Example Usage

* You can link an issue to your pull request, allowing CodeRabbit to assess whether your changes satisfy the issue's requirements. To link a Linear Issue, add the team key and issue number to the PR description: `Closes https://linear.app/company/issue/DEV-123`. See [Linked Issues](/guides/linked-issues) for details.
* You can also create new Linear issues directly through CodeRabbit. See our [Issue Creation guide](/guides/issue-creation#linear) for details.

## GitHub

GitHub issue integration works automatically without any additional setup required.

### Example Usage

To link a GitHub Issue, you can add the issue into the PR description as shown below.

```md  theme={null}
Closes #123
```


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Create issues

> Turn code discussions into tracked issues across GitHub, GitLab, Jira, and Linear directly from CodeRabbit's chat interface.

<Info>
  This feature is available exclusively as part of the Pro plan and is not
  included in the Lite plan. Please refer to our [pricing
  page](https://www.coderabbit.ai/pricing) for more information about our plans
  and features.
</Info>

When reviewing code, important issues often surface in discussions but get lost without proper tracking. CodeRabbit bridges this gap by creating issues directly from pull request conversations or chat interactions, ensuring nothing falls through the cracks.

CodeRabbit supports issue creation across GitHub, GitLab, Jira, and Linear. You can create issues naturally through conversations—just mention `@coderabbitai` and describe what needs to be tracked.

## Creating issues through agentic chat

<img src="https://mintcdn.com/coderabbit/-1tM0NTfFyDTkoSm/images/guides/assets/images/create-issue-agentic.png?fit=max&auto=format&n=-1tM0NTfFyDTkoSm&q=85&s=1bf8ad1b9f81772e75b4fad066e11f80" alt="Creating an issue through CodeRabbit's agentic chat interface" data-og-width="1512" width="1512" data-og-height="974" height="974" data-path="images/guides/assets/images/create-issue-agentic.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/coderabbit/-1tM0NTfFyDTkoSm/images/guides/assets/images/create-issue-agentic.png?w=280&fit=max&auto=format&n=-1tM0NTfFyDTkoSm&q=85&s=f0397fdf4e2189e6820b29054a66418d 280w, https://mintcdn.com/coderabbit/-1tM0NTfFyDTkoSm/images/guides/assets/images/create-issue-agentic.png?w=560&fit=max&auto=format&n=-1tM0NTfFyDTkoSm&q=85&s=42810b3b76081934b8212fd42fc882ea 560w, https://mintcdn.com/coderabbit/-1tM0NTfFyDTkoSm/images/guides/assets/images/create-issue-agentic.png?w=840&fit=max&auto=format&n=-1tM0NTfFyDTkoSm&q=85&s=1a5cae7e9a20cd0db53af33f57bfcd55 840w, https://mintcdn.com/coderabbit/-1tM0NTfFyDTkoSm/images/guides/assets/images/create-issue-agentic.png?w=1100&fit=max&auto=format&n=-1tM0NTfFyDTkoSm&q=85&s=2c4c9235583c7f160ea03d84f19a7617 1100w, https://mintcdn.com/coderabbit/-1tM0NTfFyDTkoSm/images/guides/assets/images/create-issue-agentic.png?w=1650&fit=max&auto=format&n=-1tM0NTfFyDTkoSm&q=85&s=e1e65ae55efb66eab8d5e363c26a2c6a 1650w, https://mintcdn.com/coderabbit/-1tM0NTfFyDTkoSm/images/guides/assets/images/create-issue-agentic.png?w=2500&fit=max&auto=format&n=-1tM0NTfFyDTkoSm&q=85&s=d56c25f2907654b01ba500e72c973d57 2500w" />

The most straightforward way to create issues is through CodeRabbit's chat interface. During pull request reviews or in comment threads, mention `@coderabbitai` and ask to create an issue. CodeRabbit analyzes the context and creates a well-structured issue with relevant details (code context, discussion history, etc.) for your chosen platform.

<img src="https://mintcdn.com/coderabbit/eCc0RioaztckLlGU/images/assets/images/create-issue.png?fit=max&auto=format&n=eCc0RioaztckLlGU&q=85&s=87a2bcdc6f1e7cfe3ac36a313fe40d35" alt="An issue created by CodeRabbit" data-og-width="1818" width="1818" data-og-height="906" height="906" data-path="images/assets/images/create-issue.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/coderabbit/eCc0RioaztckLlGU/images/assets/images/create-issue.png?w=280&fit=max&auto=format&n=eCc0RioaztckLlGU&q=85&s=ba5d7b5efa03d27cc9d019a9a312cf6b 280w, https://mintcdn.com/coderabbit/eCc0RioaztckLlGU/images/assets/images/create-issue.png?w=560&fit=max&auto=format&n=eCc0RioaztckLlGU&q=85&s=90d9b8172df238d097abb4ba318bdbfc 560w, https://mintcdn.com/coderabbit/eCc0RioaztckLlGU/images/assets/images/create-issue.png?w=840&fit=max&auto=format&n=eCc0RioaztckLlGU&q=85&s=92615932e04cd3481d88e0e1d441f407 840w, https://mintcdn.com/coderabbit/eCc0RioaztckLlGU/images/assets/images/create-issue.png?w=1100&fit=max&auto=format&n=eCc0RioaztckLlGU&q=85&s=ab699779dfb7820a0920fedbaa9e8b69 1100w, https://mintcdn.com/coderabbit/eCc0RioaztckLlGU/images/assets/images/create-issue.png?w=1650&fit=max&auto=format&n=eCc0RioaztckLlGU&q=85&s=9d6307f661feb2a2474555e4d99b29bf 1650w, https://mintcdn.com/coderabbit/eCc0RioaztckLlGU/images/assets/images/create-issue.png?w=2500&fit=max&auto=format&n=eCc0RioaztckLlGU&q=85&s=1fb420612d6bd4a20fcb4bdbb2a062d6 2500w" />

## Supported platforms

<CardGroup cols={2}>
  <Card title="Git-based platforms" icon="git-alt">
    **GitHub and GitLab** issues work automatically without additional setup.
    CodeRabbit creates issues directly in your repository.
  </Card>

  <Card title="Jira" icon="jira">
    Create Jira tickets after configuring the [Jira
    integration](/integrations/issue-integrations#jira).
  </Card>

  <Card title="Linear" icon="linear">
    Generate Linear issues once you've set up the [Linear
    integration](/integrations/issue-integrations#linear).
  </Card>
</CardGroup>

## Best practices

<CardGroup cols={2}>
  <Card title="Provide context" icon="code">
    Include relevant code snippets, error messages, or discussion context when
    requesting issue creation. This helps CodeRabbit generate more detailed and
    actionable issues.
  </Card>

  <Card title="Specify the platform" icon="arrow-pointer">
    If you have multiple issue platforms configured, explicitly mention which
    one to use: "Create a Jira ticket for this" or "Add this to Linear."
  </Card>

  <Card title="Include assignee information" icon="user">
    Mention specific team members who should handle the issue: "Create an issue
    for @username to investigate this performance problem."
  </Card>

  <Card title="Set priority and timing" icon="clock">
    Indicate urgency or deadlines: "Create a high-priority issue for the memory
    leak in checkout flow" or "Add this to the next sprint."
  </Card>
</CardGroup>

For detailed information about configuring issue tracking integrations, see our [Issue Integrations](/integrations/issue-integrations) guide.


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Linked issues

> CodeRabbit provides intelligent assessment of linked issues to validate whether pull requests properly address their requirements. This guide explains how to effectively use linked issues and write clear issue descriptions for optimal results.

<Note>
  To use linked issues with Jira or Linear, you must first enable the
  corresponding integration. Note that these integrations are enabled for
  private repositories by default, but disabled for public repositories. See
  [Issue trackers](/integrations/issue-integrations) for setup instructions.
</Note>

## Understanding linked issues

A linked issue is one that is explicitly referenced in your pull request description using platform-specific syntax:

<CodeGroup>
  ```bash GitHub theme={null}
  fixes #123
  closes #123
  resolves #123
  ```

  ```bash GitLab theme={null}
  closes #123
  fixes #123
  https://gitlab.com/org/repo/-/issues/123
  ```

  ```bash Jira/Linear theme={null}
  https://company.atlassian.net/browse/PROJ-123
  https://linear.app/company/issue/DEV-123
  ```
</CodeGroup>

When CodeRabbit detects linked issues, it analyzes them against your pull request changes to determine if the requirements are met:

<Frame caption="A well-structured Linear issue with clear acceptance criteria">
  <img src="https://mintcdn.com/coderabbit/Co8e_X7cqpCRRVAF/images/assets/images/linked-issue.png?fit=max&auto=format&n=Co8e_X7cqpCRRVAF&q=85&s=b87b902378d67c90bd1f29c5766f6897" alt="Example of a linked Linear issue with summary, technical notes, and acceptance criteria" data-og-width="1772" width="1772" data-og-height="1068" height="1068" data-path="images/assets/images/linked-issue.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/coderabbit/Co8e_X7cqpCRRVAF/images/assets/images/linked-issue.png?w=280&fit=max&auto=format&n=Co8e_X7cqpCRRVAF&q=85&s=461a7c642b5731936a60b39458d2111a 280w, https://mintcdn.com/coderabbit/Co8e_X7cqpCRRVAF/images/assets/images/linked-issue.png?w=560&fit=max&auto=format&n=Co8e_X7cqpCRRVAF&q=85&s=f3e26bbaa7b57fbfaa18e75797cc3343 560w, https://mintcdn.com/coderabbit/Co8e_X7cqpCRRVAF/images/assets/images/linked-issue.png?w=840&fit=max&auto=format&n=Co8e_X7cqpCRRVAF&q=85&s=aac81dbcaacad68745ca1be3fd9d97ec 840w, https://mintcdn.com/coderabbit/Co8e_X7cqpCRRVAF/images/assets/images/linked-issue.png?w=1100&fit=max&auto=format&n=Co8e_X7cqpCRRVAF&q=85&s=78f84b8e5731439b6d3a8482286a3e75 1100w, https://mintcdn.com/coderabbit/Co8e_X7cqpCRRVAF/images/assets/images/linked-issue.png?w=1650&fit=max&auto=format&n=Co8e_X7cqpCRRVAF&q=85&s=3fd6b6eff52a73c2623d1c9e1aa642b3 1650w, https://mintcdn.com/coderabbit/Co8e_X7cqpCRRVAF/images/assets/images/linked-issue.png?w=2500&fit=max&auto=format&n=Co8e_X7cqpCRRVAF&q=85&s=697734da6adaf4e63eb6a222030fdc72 2500w" />
</Frame>

If a requirement from the linked issue isn't addressed, CodeRabbit flags it during review:

<Frame caption="CodeRabbit identifies a missing requirement from the linked issue">
  <img src="https://mintcdn.com/coderabbit/Co8e_X7cqpCRRVAF/images/assets/images/linked-issue-failed-check.png?fit=max&auto=format&n=Co8e_X7cqpCRRVAF&q=85&s=5c0e44ab2b0d754f639cdb5004b41dbb" alt="CodeRabbit review comment showing a potential issue where a linked issue requirement was not addressed" data-og-width="1656" width="1656" data-og-height="1598" height="1598" data-path="images/assets/images/linked-issue-failed-check.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/coderabbit/Co8e_X7cqpCRRVAF/images/assets/images/linked-issue-failed-check.png?w=280&fit=max&auto=format&n=Co8e_X7cqpCRRVAF&q=85&s=4563bf22fab2c505f6b900ed96b0f444 280w, https://mintcdn.com/coderabbit/Co8e_X7cqpCRRVAF/images/assets/images/linked-issue-failed-check.png?w=560&fit=max&auto=format&n=Co8e_X7cqpCRRVAF&q=85&s=0c7cfc859cde36c51ec7c10bda5174e9 560w, https://mintcdn.com/coderabbit/Co8e_X7cqpCRRVAF/images/assets/images/linked-issue-failed-check.png?w=840&fit=max&auto=format&n=Co8e_X7cqpCRRVAF&q=85&s=c91380dbfddb0d2bcc35beea0d9af9ae 840w, https://mintcdn.com/coderabbit/Co8e_X7cqpCRRVAF/images/assets/images/linked-issue-failed-check.png?w=1100&fit=max&auto=format&n=Co8e_X7cqpCRRVAF&q=85&s=040f8ea0b35e7a52ee6d1232e8956802 1100w, https://mintcdn.com/coderabbit/Co8e_X7cqpCRRVAF/images/assets/images/linked-issue-failed-check.png?w=1650&fit=max&auto=format&n=Co8e_X7cqpCRRVAF&q=85&s=bf86eb65464d4ee7763ff2e4734b9444 1650w, https://mintcdn.com/coderabbit/Co8e_X7cqpCRRVAF/images/assets/images/linked-issue-failed-check.png?w=2500&fit=max&auto=format&n=Co8e_X7cqpCRRVAF&q=85&s=216245ff3882e4cd56b43d99242b6808 2500w" />
</Frame>

## Best practices for issue writing

### Issue titles

Create descriptive, technical titles that clearly state the goal:

<Tabs>
  <Tab title="Good examples">
    * "Add PrismaLint integration to configuration flow"
    * "Fix race condition in user authentication"
    * "Implement caching for GraphQL queries"
  </Tab>

  <Tab title="Poor examples">
    * "Fix bug"
    * "Update code"
    * "Improve performance"
  </Tab>
</Tabs>

### Issue descriptions

Write comprehensive descriptions that provide clear technical context:

<Steps>
  <Step title="Problem statement">
    * Clearly describe what needs to be changed
    * Include technical details about affected components
    * Reference specific files or functions if known
  </Step>

  <Step title="Expected solution">
    * Outline the desired implementation approach
    * Include code examples or pseudo-code when relevant
    * List specific acceptance criteria
  </Step>
</Steps>

**Example description:**

```markdown  theme={null}
Problem:
The configuration system doesn't validate Prisma schema files before deployment,
leading to potential runtime errors.

Solution:
Integrate PrismaLint into the configuration flow to:

- Validate schema files during PR checks
- Enforce consistent naming conventions
- Prevent common Prisma anti-patterns

Affected Components:

- Configuration validation pipeline
- CI/CD workflow
- Schema validation logic

Acceptance Criteria:

- [ ] PrismaLint runs on all PR checks
- [ ] Failed validations block merging
- [ ] Clear error messages for schema issues
```

### Consistent terminology

Use consistent terminology between issues and pull requests:

<Tabs>
  <Tab title="Good practices">
    * Use the same technical terms consistently
    * Reference components with their exact names
    * Maintain consistent naming patterns
  </Tab>

  <Tab title="Poor practices">
    * Mixing different terms for the same component
    * Using vague or non-technical language
    * Inconsistent capitalization or formatting
  </Tab>
</Tabs>

## Linking issues effectively

### In pull requests

<Tabs>
  <Tab title="Direct references">
    ```md  theme={null}
    Fixes #123
    Resolves organization/repo#456
    Closes https://github.com/org/repo/issues/789
    ```
  </Tab>

  <Tab title="Multiple issues">
    ```md  theme={null}
    This PR addresses:
    - Fixes #123
    - Closes #456
    - Resolves https://jira.company.com/browse/PROJ-789
    ```
  </Tab>
</Tabs>

### Cross-references

For better traceability:

<Steps>
  <Step title="Add PR references in issue comments">
    Link back to the pull request from the issue discussion
  </Step>

  <Step title="Use complete URLs for external systems">
    Include full URLs when referencing Jira, Linear, or other platforms
  </Step>

  <Step title="Maintain bidirectional links">
    Ensure related issues reference each other for complete context
  </Step>
</Steps>

## How CodeRabbit assesses linked issues

CodeRabbit evaluates linked issues through this process:

<Steps>
  <Step title="Analyze issue content">
    Reviews issue titles and descriptions for requirements and context
  </Step>

  <Step title="Compare PR changes">
    Examines the code changes in the pull request
  </Step>

  <Step title="Validate requirements">
    Determines if the changes meet the stated objectives
  </Step>

  <Step title="Provide assessment">
    Returns one of three possible outcomes:

    * ✅ **Addressed**: Objective completed (no explanation needed)
    * ❌ **Not addressed**: Objective not met (explanation provided)
    * ❓ **Unclear**: Uncertain if objective is met (explanation provided)
  </Step>
</Steps>

<Note>
  Only the issue title and description are considered in the assessment.
  Comments and discussion threads are not currently analyzed.
</Note>

## Tips for better assessments

<CardGroup cols={2}>
  <Card title="Be specific">
    * Include clear, measurable objectives
    * List specific technical requirements
    * Reference affected code components
  </Card>

  <Card title="Provide context">
    * Explain why changes are needed
    * Document current behavior
    * Describe expected outcomes
  </Card>

  <Card title="Use technical details">
    * Include file paths when known
    * Reference specific functions or classes
    * Mention relevant technologies
  </Card>

  <Card title="Keep it focused">
    * One main objective per issue
    * Clear scope boundaries
    * Specific acceptance criteria
  </Card>
</CardGroup>

## Related resources

<CardGroup cols={3}>
  <Card title="Review instructions" href="/guides/review-instructions">
    Learn how to add custom instructions to your reviews
  </Card>

  <Card title="Issue creation" href="/guides/issue-creation">
    Automatically create issues from PR reviews
  </Card>

  <Card title="Issue trackers" href="/integrations/issue-integrations">
    Set up Jira or Linear integrations for linked issues
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# Issue Enrichment

> CodeRabbit automatically analyzes your issues to detect duplicates, find related issues and PRs, suggest assignees, and apply smart labels.

<Note>Issue Enrichment is a beta feature.</Note>

## Overview

CodeRabbit Issue Enrichment automatically analyzes your issues and provides contextual
insights to help you work more efficiently. When you create or edit an issue, CodeRabbit
posts a comment with:

* 🔍 **Duplicate Detection** - Identifies if your issue already exists
* 🔗 **Similar Issues** - Shows related issues that might have solutions or context
* 🔗 **Related Pull Requests** - Finds PRs that addressed similar problems
* 👤 **Suggested Assignees** - Recommends team members based on expertise
* 🏷️ **Smart Labeling** - Automatically categorizes issues with appropriate labels

<Tip>
  Looking to generate implementation plans from issues? Check out [CodeRabbit
  Plan Mode](/issues/planning) for comprehensive step-by-step guides.
</Tip>

## Getting Started

Issue enrichment is enabled by default on GitHub issues. CodeRabbit will automatically enrich new issues with contextual information.

### Disable Issue Enrichment

To turn off automatic enrichment, add this to your `.coderabbit.yaml` configuration file:

```yaml  theme={null}
issue_enrichment:
  auto_enrich:
    enabled: false
```

## Features

### Duplicate Detection

CodeRabbit analyzes your issue against existing issues in your repository and knowledge
base to detect potential duplicates.

**What you'll see:**

```markdown  theme={null}
## 🔗 Similar Issues

**Possible Duplicates**

- https://github.com/owner/repo/issues/42
```

### Similar Issues

Discover related issues that might provide context, workarounds, or solutions.

**What you'll see:**

```markdown  theme={null}
## 🔗 Similar Issues

**Related Issues**

- https://github.com/owner/repo/issues/15
- https://github.com/owner/repo/issues/28
- https://github.com/owner/repo/issues/31
```

### Related Pull Requests

See PRs that addressed similar problems or touched related code.

**What you'll see:**

```markdown  theme={null}
## 🔗 Related PRs

#123 - Fix authentication bug [merged]
#145 - Update auth flow [open]
#98 - Improve login error handling [closed]
```

### Suggested Assignees

Get smart recommendations for who should work on the issue based on past contributions
to related issues and PRs.

**What you'll see:**

```markdown  theme={null}
## 👤 Suggested Assignees

- [@guritfaq](https://github.com/guritfaq)
- [@harjotgill](https://github.com/harjotgill)
- [@aravindputrevu](https://github.com/aravindputrevu)
```

### Smart Auto-Labeling

Automatically apply appropriate labels to issues based on their content.

#### Configuration

```yaml  theme={null}
issue_enrichment:
  labeling:
    auto_apply_labels: true
    labeling_instructions:
      - label: bug
        instructions: Issues reporting bugs, errors, crashes, incorrect behavior, or unexpected results. This includes runtime errors, logic errors, broken functionality, regressions, and any deviation from expected or documented behavior.
      - label: enhancement
        instructions: Feature requests, improvements to existing functionality, performance optimizations, refactoring suggestions, UI/UX enhancements, and any suggestions to make the project better or add new capabilities.
      - label: documentation
        instructions: Documentation updates, additions, corrections, or clarifications needed. This includes missing docs, outdated information, unclear instructions, API documentation, code examples, README improvements, and any requests for better explanations or guides.
```

## Platform Support

### Currently Supported

* ✅ **GitHub** - Full support for all enrichment features

### Coming Soon

* 🔄 **Linear** - Native Linear issue tracker enrichment
* 🔄 **Jira** - Native Jira issue tracker enrichment

## Frequently Asked Questions

### Can I customize what information is shown?

Currently, the enrichment format is standardized, but you can customize label categories with auto-labeling and configure auto-planning to choose which issues get plans.

### Does enrichment work for private repositories?

Yes! Issue enrichment works for both public and private repositories. Knowledge base and
enrichment respect your repository access controls.

### How does CodeRabbit find related issues and PRs?

CodeRabbit uses semantic similarity search on your knowledge base by indexing issues and PRs based upon vectorized representations (which cannot be reversed into the original issues and PR's).

### Will enrichment update when I edit the issue?

Yes! When you edit an issue that already has enrichment, CodeRabbit will re-analyze the updated content, search for new related issues and PRs, update the enrichment comment, and trigger auto-planning if labels changed.

## Support and Feedback

<Tip>
  Visit our [support page](/getting-started/support) or join our [Discord
  community](https://discord.gg/coderabbit) for assistance or feedback.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt

# CodeRabbit Plan Mode

> Generate comprehensive implementation plans from GitHub issues that you can use with your favorite coding agent or IDE copilot.

<Note>Plan Mode is a beta feature available as part of Issue Enrichment.</Note>

## Overview

CodeRabbit Plan Mode analyzes your issues and generates comprehensive implementation plans that you can copy-paste into your favorite coding agent or IDE copilot. When you request a plan, CodeRabbit provides:

* 📋 **Step-by-step implementation plan** with detailed instructions
* 📁 **File-specific guidance** on what needs to be changed
* 💡 **Code examples and patterns** from your codebase
* ✅ **Testing recommendations** to validate the implementation

<Tip>
  See [Issue Enrichment](/issues/issue_enrichment) for other automatic insights
  like duplicate detection, similar issues, and suggested assignees.
</Tip>

## Configuration

Planning is enabled by default. To disable it, add this to your `.coderabbit.yaml`:

```yaml  theme={null}
issue_enrichment:
  planning:
    enabled: false
```

## Using Plan Mode

Once enabled, you'll see a checkbox in the enrichment comment:

```markdown  theme={null}
## 📝 CodeRabbit Plan Mode

Generate an implementation plan and prompts that you can use with your favorite coding
agent.

- [ ] Create Plan
```

**To generate a plan:**

1. Check the "Create Plan" checkbox, OR
2. Comment `@coderabbitai plan` on the issue

**What you'll get:** A step-by-step implementation plan with file-specific instructions, code examples and patterns, and testing recommendations.

<Note>
  Plan generation is asynchronous and can take up to \~10 minutes to complete.
  You'll receive a notification when the plan is ready, or you can check back on
  the issue to see the updated comment.
</Note>

**Example plans:**

* [Example 1](https://github.com/coderabbitai/git-worktree-runner/issues/29#issuecomment-3589134556)
* [Example 2](https://github.com/coderabbitai/git-worktree-runner/issues/12#issuecomment-3606665167)

## Auto-Planning

Automatically generate plans when specific labels are added to issues.

```yaml  theme={null}
issue_enrichment:
  planning:
    enabled: true
    auto_planning:
      enabled: true
      labels:
        - "plan-me" # Auto-plan issues with this label
        - "ready" # Also auto-plan these
        - "!no-plan" # Never auto-plan issues with this label
```

**Label Matching Rules:**

* **Inclusion labels** (e.g., `plan-me`): Only plan issues with these labels
* **Exclusion labels** (e.g., `!no-plan`): Never plan issues with these labels starting with an exclamation mark (takes priority)
* **Only exclusions**: If you only configure exclusion labels, all issues except
  excluded ones will be auto-planned
* **Mixed**: If you have both, issues must have an inclusion label AND not have any
  exclusion labels

## Frequently Asked Questions

### How long does plan generation take?

Plan generation is asynchronous and typically takes 5-10 minutes, depending on the complexity of the issue and your codebase size. You'll receive a notification when the plan is ready.

### Can I regenerate a plan?

Yes! You can request a new plan at any time by checking the "Create Plan" checkbox again or commenting `@coderabbitai plan`. This is useful if you've updated the issue description or want fresh suggestions.

### What information does CodeRabbit use to generate plans?

CodeRabbit analyzes:

* The issue description and comments
* Your repository's codebase structure
* Similar resolved issues and PRs
* Existing code patterns and conventions
* Test coverage and patterns

## Support and Feedback

<Tip>
  Visit our [support page](/getting-started/support) or join our [Discord
  community](https://discord.gg/coderabbit) for assistance or feedback.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.coderabbit.ai/llms.txt




const { gql } = require("graphql-request");

const contentQuery = gql`
  query($name: String!) {
    values: titledContent(where: { name: $name }) {
      content {
        html
      }
      title
    }
  }
`;

const multiContentQuery = gql`
  query($name: String!) {
    values: multiContent(where: { name: $name }) {
      contents {
        html
      }
      title
    }
  }
`;

const projectInformationQuery = gql`
  query($name: String!) {
    values: projectInformation(where: { name: $name }) {
      title
    }
  }
`;

const projectItemQuery = gql`
  query($name: String!) {
    projectItem: projectsItem(where: { name: $name }) {
      content {
        html
      }
      title
      linkCaption
      link
      blurb
      pdf {
        url
      }
    }
  }
`;

const bannerQuery = gql`
  query($name: String!) {
    values: bannerImage(where: { name: $name }) {
      image {
        url
      }
      title
    }
  }
`;

const topNewsQuery = gql`
  query($fetchCount: Int) {
    newsList: newsItems(first: $fetchCount, orderBy: publishedDate_DESC) {
      publishedDate
      title
      image {
        url
      }
      category
      blurb
      slug
    }
  }
`;

const newsQuery = gql`
  query($slug: String!) {
    newsItem: newsItems(where: { slug: $slug }) {
      publishedDate
      title
      image {
        url
      }
      blurb
      detail {
        html
      }
    }
  }
`;

const newsCategoryQuery = gql`
  query introspectNewsCategoryType {
    __type(name: "NewsCategory") {
      enumValues {
        name
      }
    }
  }
`;

const topEventsQuery = gql`
  query($fetchCount: Int) {
    eventsList: eventsItems(first: $fetchCount, orderBy: startDate_DESC) {
      startDate
      endDate
      title
      image {
        url
      }
      category
      slug
      blurb
    }
  }
`;

const eventQuery = gql`
  query($slug: String!) {
    eventItem: eventsItems(where: { slug: $slug }) {
      startDate
      endDate
      title
      image {
        url
      }
      detail {
        html
      }
      blurb
      externalLink
    }
  }
`;

const eventsCategoryQuery = gql`
  query introspectEventsCategoryType {
    __type(name: "EventsCategory") {
      enumValues {
        name
      }
    }
  }
`;

const topToolsQuery = gql`
  query($fetchCount: Int) {
    toolsList: toolsItems(first: $fetchCount, orderBy: publishedDate_DESC) {
      publishedDate
      title
      image {
        url
      }
      category
      blurb
      slug
      link
    }
  }
`;

const toolsQuery = gql`
  query($slug: String!) {
    toolsItem: toolsItems(where: { slug: $slug }) {
      publishedDate
      title
      image {
        url
      }
      blurb
      detail {
        html
      }
      link
    }
  }
`;

const toolsCategoryQuery = gql`
  query introspectToolsCategoryType {
    __type(name: "ToolsCategory") {
      enumValues {
        name
      }
    }
  }
`;

const feedbackReasonQuery = gql`
  query introspectFeedbackReasonType {
    __type(name: "FeedbackReason") {
      enumValues {
        name
      }
    }
  }
`;

const contactReasonQuery = gql`
  query introspectContactReasonType {
    __type(name: "ContactReason") {
      enumValues {
        name
      }
    }
  }
`;

const contactAreaQuery = gql`
  query introspectContactAreaType {
    __type(name: "ContactArea") {
      enumValues {
        name
      }
    }
  }
`;

module.exports = {
  contentQuery,
  multiContentQuery,
  projectInformationQuery,
  projectItemQuery,
  bannerQuery,
  topNewsQuery,
  newsQuery,
  newsCategoryQuery,
  topEventsQuery,
  eventQuery,
  eventsCategoryQuery,
  topToolsQuery,
  toolsQuery,
  toolsCategoryQuery,
  feedbackReasonQuery,
  contactReasonQuery,
  contactAreaQuery,
};

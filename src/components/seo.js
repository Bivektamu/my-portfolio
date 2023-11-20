/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react";
import { Helmet } from "react-helmet";

function Seo({ description, lang, meta, title, author }) {
  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Poppins:200,200i,300,300i,400,400i,500,500i,600,600i,700&display=swap"
      />
    </Helmet>
  );
}
export default Seo;

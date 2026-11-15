import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  // The orientation explainer left the site: orientation belongs to the BAC
  // reader, this site is about the university itself.
  async redirects() {
    return [{ source: "/kayfa", destination: "/hayat", permanent: true }];
  },
};

export default config;

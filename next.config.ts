import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
      protocol:'https',
      hostname:'utfs.io'
    },
      {
      protocol:'https',
      hostname:'cdn.pixabay.com'
    }
    ]
  }
};

export default nextConfig;

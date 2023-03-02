const { withAxiom } = require("next-axiom")

module.exports = withAxiom({
  reactStrictMode: true,
  transpilePackages: ["ui"]
})

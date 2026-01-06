import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative flex flex-col items-center justify-center pt-12 pb-20 px-4 bg-white">
      <div className="hero-glow" />
      <div className="layout-content-container flex flex-col max-w-300 w-full z-10">
        <div className="@container">
          <div className="flex flex-col gap-12 py-10 @[864px]:flex-row items-center">
            <div className="flex flex-col gap-6 flex-1 items-start text-left">
              <div className="flex flex-col gap-4">
                <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-blue-100">
                  🚀 The Future of Hiring
                </span>
                <h1 className="text-slate-900 text-5xl font-black leading-[1.1] tracking-[-0.033em] @[480px]:text-6xl">
                  AI-Driven Interviews.
                  <br />
                  <span className="gradient-text">Smarter Hiring.</span>
                  <br />
                  Instantly.
                </h1>
                <h2 className="text-slate-500 text-lg font-normal leading-relaxed max-w-xl">
                  Automate your screening process with real-time adaptive
                  questioning and instant scoring. Hire the best talent 10x
                  faster with bias-free assessments.
                </h2>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                <Link href="/login">
                  <button className="flex min-w-35 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-blue-600 transition-all text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/25">
                    <span className="truncate">Start AI Interview</span>
                  </button>
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                <div className="flex -space-x-2 overflow-hidden">
                  <div
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200"
                    data-alt="User avatar 1"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBDmTKA3yBYJe0xZPc7EaT8FYFvy6DUKKTiG-iDeh2HHw25Y8JS18F6OQRGUYC9VRUpvuHmvo5NWsKysLoVKtQUj8Jp2RyOpjD9g3Uwr3Np_EKCl72EyrC3urJwxNdF76pca2_O7o_IGTpYGGWyN9tY8wNf8raL_YIA9Byu8S-jNmn6uXeFPvseKBcPSWynnA-Fg0ycy7iUzaXoiWisLAvwgX8iTGPmLiqsYxLFR3eApMyHCmNMiWte9JR81bu0o4GHuIiwJuyPhbYq")',
                      backgroundSize: "cover",
                    }}
                  />
                  <div
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200"
                    data-alt="User avatar 2"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuARTig_xAqHJNjBHSPUiXq88lp9StyVkSwJHyvvroNMgb1cRbTf6dKT_SsKWuCWAf8c_xD2TCb1-7IEyHJZP8zqb0fL9QDN0VmQI0s2ZeDCfd8soFIbfaCvsfJsxcgK9-nBhFB1jchBXMoizBD4i6-_5QFYEkLFP6O7VSqBJerFN2RtC9qCpBDPDQ7SqVqfSqDr3pBO50cHbJIRk7IPDZ8xxpCBW-PnGOdJAKrJuI3lJ6so1gf1lhulsoBbFJFOk_SCCR-5WwwJ3Jpv")',
                      backgroundSize: "cover",
                    }}
                  />
                  <div
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200"
                    data-alt="User avatar 3"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC9f84urQ9INdsguRYxJCupYFOMdwGSQzAY4vHobttorVdQOtAk4RsIe4fLb2ZN0Zd4wXpz-xrXAf0a2fAJFVqIJ1DTKEk0a2_DLWma-bSxsGVLYW-h0sVgVr174d7URu7dgyxNpWHQ7IDA_g4FYzIhz-pzPle2cunbSHDjS_TyRO9rfebfBBJU-LCPndwB40VuQBXYgLk4_hrwqtjqZSeh_NYYNq7Aof6XL8iP4BHYp2EyLKio84bPBYYBDR6SRyKf8TEFaa2ugHUq")',
                      backgroundSize: "cover",
                    }}
                  />
                </div>
                <span>Trusted by 500+ Hiring Teams</span>
              </div>
            </div>
            <div className="w-full flex-1 relative group perspective-1000">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-200 to-purple-200 rounded-xl blur opacity-60 group-hover:opacity-80 transition duration-1000 group-hover:duration-200" />
              <div className="relative w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xl flex flex-col">
                <div className="h-10 border-b border-slate-200 bg-slate-50 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="ml-auto flex items-center gap-2 px-2 py-1 rounded bg-slate-200 text-xs text-slate-500 font-medium">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />{" "}
                    REC 00:04:23
                  </div>
                </div>
                <div className="min-h-fit h-125 relative bg-slate-100 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    data-alt="Professional woman in business attire looking at camera, representing an interview candidate"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDAEVyyjZ2o9WBFlcul9vZBrkAW1w5u8cJ1IGxFxzxt21TbyywzfUxHavE9ux82kuGZVUmw8EqU0ednoblk-q8vxCCWZgmAN-XvDQpxEFl2WU5It5ps7LjxMGjnpVMHOa5DkBtM_oFl2QkVwi6HHvByzHSnY7wnmFY83Fs4tWCrR4wPKrY1pwhSScyi_SGdQeZcyBzNThQ0qgXFQ8_aBoEQNqMrPMk0-uXfeUJc_FTpZiAG5sZjhdq5hx3YRiJcCDK5j-yqof7jDnV6")',
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "top"
                    }}
                  />
                  <div className="absolute bottom-4 right-4 w-32 h-24 bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-600 text-xs flex-col gap-1">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                        <span className="material-symbols-outlined text-primary text-lg">
                          smart_toy
                        </span>
                      </div>
                      <span className="font-medium">AI Interviewer</span>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 glass-panel rounded-lg p-3 max-w-50 border-l-4 border-l-green-500 shadow-lg">
                    <p className="text-xs text-slate-900 uppercase font-bold mb-1">
                      Live Sentiment
                    </p>
                    <div className="flex items-center justify-between text-slate-900 text-sm font-semibold">
                      <span>Confident</span>
                      <span className="text-green-300">&nbsp;94%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1 mt-1 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-[94%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

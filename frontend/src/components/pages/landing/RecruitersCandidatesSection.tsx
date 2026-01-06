// export default function RecruitersCandidatesSection() {
//   return (
//     <div className="py-24 bg-white">
//       <div className="layout-content-container max-w-[1200px] mx-auto px-4">
//         <div className="grid md:grid-cols-2 gap-12">
//           <div className="flex flex-col gap-6 p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-lg">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md shadow-blue-200">
//                 <span className="material-symbols-outlined">
//                   business_center
//                 </span>
//               </div>
//               <h3 className="text-2xl font-bold text-slate-900">
//                 For Recruiters
//               </h3>
//             </div>
//             <ul className="space-y-4">
//               <li className="flex gap-3 text-slate-700">
//                 <span className="material-symbols-outlined text-green-500">
//                   check_circle
//                 </span>
//                 <span>
//                   <strong>Save 90% Time:</strong> Automate initial screening
//                   calls.
//                 </span>
//               </li>
//               <li className="flex gap-3 text-slate-700">
//                 <span className="material-symbols-outlined text-green-500">
//                   check_circle
//                 </span>
//                 <span>
//                   <strong>Data-Driven:</strong> Make decisions based on scores,
//                   not gut feelings.
//                 </span>
//               </li>
//               <li className="flex gap-3 text-slate-700">
//                 <span className="material-symbols-outlined text-green-500">
//                   check_circle
//                 </span>
//                 <span>
//                   <strong>Faster Shortlisting:</strong> Review top candidates in
//                   minutes.
//                 </span>
//               </li>
//             </ul>
//           </div>
//           <div className="flex flex-col gap-6 p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-lg">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 bg-purple-600 rounded-lg text-white shadow-md shadow-purple-200">
//                 <span className="material-symbols-outlined">person</span>
//               </div>
//               <h3 className="text-2xl font-bold text-slate-900">
//                 For Candidates
//               </h3>
//             </div>
//             <ul className="space-y-4">
//               <li className="flex gap-3 text-slate-700">
//                 <span className="material-symbols-outlined text-green-500">
//                   check_circle
//                 </span>
//                 <span>
//                   <strong>Fair Interviews:</strong> Consistent questions for
//                   everyone.
//                 </span>
//               </li>
//               <li className="flex gap-3 text-slate-700">
//                 <span className="material-symbols-outlined text-green-500">
//                   check_circle
//                 </span>
//                 <span>
//                   <strong>Instant Feedback:</strong> Know where you stand
//                   immediately.
//                 </span>
//               </li>
//               <li className="flex gap-3 text-slate-700">
//                 <span className="material-symbols-outlined text-green-500">
//                   check_circle
//                 </span>
//                 <span>
//                   <strong>Flexible Timing:</strong> Interview anytime, anywhere.
//                 </span>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Building2, GraduationCap, TrendingUp } from "lucide-react";

const UseCases = () => {
  const useCases = [
    {
      icon: Building2,
      title: "HR Teams",
      subtitle: "Streamlined Hiring",
      description:
        "Transform your recruitment process with adaptive, bias-resistant assessments that reveal true candidate potential beyond traditional screening methods.",
      benefits: [
        "Reduce time-to-hire by 40%",
        "Eliminate unconscious bias",
        "Identify top performers accurately",
        "Scalable across all roles",
      ],
      color: "blue",
    },
    {
      icon: GraduationCap,
      title: "For Candidates",
      subtitle: "Personalized Learning",
      description:
        "Deliver truly personalized learning experiences that adapt in real-time to student performance and learning patterns.",
      benefits: [
        "Consistent questions for everyone.",
        "Improve learning outcomes by 60%",
        "Personalized difficulty progression",
        "Real-time performance insights",
        "Engaging adaptive content",
      ],
      color: "purple",
    },
    {
      icon: TrendingUp,
      title: "Enterprises",
      subtitle: "Employee Upskilling",
      description:
        "Upskill your workforce with intelligent, data-driven evaluations that identify skill gaps and create targeted development paths.",
      benefits: [
        "Identify skill gaps precisely",
        "Create targeted training programs",
        "Track skill development progress",
        "Optimize training ROI",
      ],
      color: "indigo",
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        gradient: "from-blue-500 to-cyan-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        text: "text-blue-400",
      },
      purple: {
        gradient: "from-purple-500 to-pink-500",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        text: "text-purple-400",
      },
      indigo: {
        gradient: "from-indigo-500 to-blue-500",
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/20",
        text: "text-indigo-400",
      },
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <section id="use-cases" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-700 mb-6">
            Who is it{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-700 bg-clip-text text-transparent">
              for
            </span>
            ?
          </h2>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto">
            AI Interviewer is designed to revolutionize assessment and learning across
            diverse industries and use cases
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const colors = getColorClasses(useCase.color);
            return (
              <div
                key={index}
                className="group relative  flex flex-col gap-6 p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-lg"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-linear-to-r ${colors.gradient} p-4 mb-6 transform group-hover:rotate-12 transition-transform duration-300`}
                >
                  <useCase.icon className="w-8 h-8 text-white" />
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className={`text-lg font-semibold ${colors.text} mb-4`}>
                    {useCase.subtitle}
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    {useCase.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {useCase.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-3">
                      <span
                        className={`material-symbols-outlined text-blue-600`}
                      >
                        check_circle
                      </span>
                      <span className="text-slate-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div
                  className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300"
                  style={{
                    backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCases;

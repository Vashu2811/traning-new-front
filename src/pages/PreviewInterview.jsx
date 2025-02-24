import { useParams } from "react-router-dom";

const PreviewInterview = () => {
  const { interviewid } = useParams();

  const Interviews = [
    {
      id: 1,
      question: "What is your greatest professional achievement?",
      answer:
        "My greatest professional achievement was leading a team that successfully launched a new product, resulting in a 30% increase in revenue within six months.",
    },
    {
      id: 2,
      question: "How do you handle tight deadlines and pressure?",
      answer:
        "I thrive under pressure and manage tight deadlines by prioritizing tasks, delegating effectively, and maintaining open communication with my team to ensure we meet our goals.",
    },
    {
      id: 3,
      question: "Can you describe a difficult problem you solved at work?",
      answer:
        "One challenging problem I solved involved streamlining our company's logistics, reducing delivery times by 20% through implementing a new software system and optimizing routes.",
    },
    {
      id: 4,
      question:
        "Tell me about a time you had a disagreement with a coworker and how you resolved it.",
      answer:
        "I had a disagreement with a coworker regarding project priorities. We scheduled a meeting, discussed our perspectives, found common ground, and established a compromise that aligned with our team's objectives.",
    },
    {
      id: 5,
      question: "How do you stay updated with industry trends?",
      answer:
        "I stay updated with industry trends by regularly attending conferences, reading industry publications, participating in webinars, and networking with professionals in the field.",
    },
    {
      id: 6,
      question:
        "Describe a situation where you had to adapt to unexpected changes.",
      answer:
        "During a project, unforeseen circumstances required a change in strategy. I quickly reassessed the situation, collaborated with the team, and successfully adapted our approach to achieve our goals.",
    },
    {
      id: 7,
      question: "What strategies do you use for effective time management?",
      answer:
        "I prioritize tasks based on urgency and importance, use time-blocking techniques, set clear goals, and regularly review my schedule to ensure maximum productivity.",
    },
    {
      id: 8,
      question: "How do you handle constructive criticism in the workplace?",
      answer:
        "I see constructive criticism as an opportunity for growth. I listen attentively, reflect on the feedback, and use it to improve my skills and performance.",
    },
    {
      id: 9,
      question: "Can you discuss a successful teamwork experience?",
      answer:
        "I worked on a cross-functional team where we collaborated effectively, leveraging each other's strengths to complete a project ahead of schedule and exceed client expectations.",
    },
    {
      id: 10,
      question: "Describe a time when you had to meet a challenging goal.",
      answer:
        "I set a challenging sales target and developed a strategic plan that involved expanding our client base and enhancing customer relationships, which resulted in surpassing the goal by 20%.",
    },
    {
      id: 11,
      question: "How do you handle stressful situations in the workplace?",
      answer:
        "I manage stress by practicing mindfulness techniques, taking short breaks, and maintaining a positive attitude. I also communicate openly with my team to address challenges effectively.",
    },
    {
      id: 12,
      question: "What motivates you in your professional life?",
      answer:
        "I am motivated by challenging projects that allow me to learn and grow. Recognition for my contributions and opportunities for advancement also drive my motivation in the workplace.",
    },
    // Add more Interview objects as required
  ];

  const specificInterviews =
    Interviews && Interviews.length > 0
      ? Interviews.filter((interview) => interview.id === parseInt(interviewid))
      : [];

  return (
    <div className="mx-12 my-4 lg:mt-20 md:mt-20 max-sm:mt-20 sm:mt-20">
      <h1 className="text-2xl text-[#BDBEBE] font-bold mb-5">
        Preview Questions
      </h1>
      {specificInterviews.length > 0 ? (
        specificInterviews.map((interview, index) => (
          <div
            key={index}
            className="border border-[#37383A] bg-[#1A1C1E] text-[#BDBEBE] p-5"
          >
            <p className="font-bold">Question </p>
            <p className="mb-5">{interview.question}</p>
            <p className="font-bold">Answer </p>
            <p className="mb-5">{interview.answer}</p>
          </div>
        ))
      ) : (
        <p>No interviews found for the specified ID</p>
      )}
    </div>
  );
};

export default PreviewInterview;

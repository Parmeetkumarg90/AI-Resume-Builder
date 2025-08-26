import Stage1 from "../components/Stages/stage 1";
import Stage3 from "../components/Stages/stage 3";
import Stage5 from "../components/Stages/stage 5";
import Stage7 from "../components/Stages/stage 7";
import TopBar from "../components/SideBar/userSidebar";
import Record from "../components/Stages/record";
import { useNavigate } from "react-router";
import sessionStore from "../store";
import { NotFoundPage } from "./Not Found";
import env from "../config/env";
import { useEffect } from "react";

export default function User() {
    const stage = sessionStore((state) => state.session?.Credential?.stage);
    const userId = sessionStore.getState().session?.Credential.userId;
    const navigate = useNavigate();
    useEffect(() => {
        if (stage && stage > 7) {
            navigate(`/profile/${userId}`);
        }
    }, []);
    if (!stage || stage < 1 || stage > 9) {
        return <NotFoundPage reason="You are on invalid stage to fill your profile." />;
    }
    const uploadApi = `${env.VITE_BACKEND_URL}/api/user/videoStage246`;

    return (
        <TopBar>
            {stage && stage === 1 && <Stage1 />}
            {stage && stage === 2 && <Record
                title="Early Life Status"
                description={
                    [
                        "Talk about places where you were born and grew up",
                        "Various cities you lived in and experienced",
                        "Talk about family and parents",
                        "Who were your friends — what did you do together?",
                        "What were the things that interested you?",
                        "Which educational institutes did you attend? Describe your experiences in these schools / colleges / universities etc. Give some idea of timelines.",
                        "Any thing else that feel natural for this video"
                    ]
                }
                name_of_video={`EarlyLife-${sessionStore.getState().session?.Credential.userId}`} uploadApi={uploadApi}
                stage={stage}
            />}
            {stage && stage === 3 && <Stage3 />}
            {stage && stage === 4 && <Record
                title="Professional Life Status"
                description={
                    [
                        "No. of years in your professional journey",
                        "Cover the various jobs / roles you have had as an intern, employee, founder, owner, freelancer",
                        "Name the organisations you have worked with, what role and work you did, how long, which cities / countries",
                        "From each role - share the specific learnings or experiences or incidents that stand out or seem worth sharing",
                        "Cover all career except what you are doing right now"
                    ]
                }
                name_of_video={`ProfessionalLife-${sessionStore.getState().session?.Credential.userId}`} uploadApi={uploadApi}
                stage={stage}
            />}
            {stage && stage === 5 && <Stage5 />}
            {stage && stage === 6 && <Record
                title="Current Life Status"
                description={
                    [
                        "Clearly state your name, which city/country you are based in",
                        "Give a brief introduction / overview of yourself - covering both professional and personal aspects",
                        "Name of your current organization and your work profile",
                        "Name the location or locations or you can say remote",
                        "How and when did you start this journey?",
                        "What work does the organization do - please describe what problems are solved via your products, solutions, services",
                        "What is the current state? What progress has been made in terms of products, customers, revenues, team size or any thing else",
                        "Anything interesting you want to share about your organisation / startup, team etc."
                    ]
                }
                name_of_video={`CurrentLife-${sessionStore.getState().session?.Credential.userId}`} uploadApi={uploadApi}
                stage={stage}
            />}
            {stage && stage === 7 && <Stage7 />}
        </TopBar>
    );
}
interface videoPropsInterface {
    title: string,
    description: string[]
}

interface stage1FormInterface {
    firstName: string,
    middleName?: string,
    lastName: string,
    currentOrganisation: string,
    currentRole: string,
    phoneNumber: string,
    currentCity: string,
    currentArea: string,
    twitterHandle?: string,
    instagramHandle?: string,
    linkedinHandle?: string,
    otherHandle?: string,
    intro: string,
    quote: string,
    inspiring: string,
    linksContent: string,
    userImage: any
}

interface stage3FormInterface { // early life stage
    bornCity: string,
    homeTown: string,
    school: {
        name: string,
        address: string,
    }[],
    college: {
        name: string,
        address: string,
        course: string[],
    }[],
    earlyTags: string[]
}

interface stage5FormInterface { // professional life stage
    previousCompany: { // from first to last
        name: string,
        role: string,
    }[],
    professionalTags: string[]
}

interface stage7FormInterface { // current life tags
    summary: string, // summary in 75 words containing current life like -> cities(where live),organisations(worked for including current with name)
    currentCompany: {
        name: string,
        role: string
    },
    frequentCityLived: string,
    currentTags: string[],
    skillTags: string[]
}

export type { videoPropsInterface, stage1FormInterface, stage3FormInterface, stage5FormInterface, stage7FormInterface };
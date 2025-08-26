export default function mapProcessedData(stage, data) {
    const update = {};

    if (stage === 2) {
        if (data.bornCity) update.bornCity = data.bornCity;
        if (data.homeTown) update.homeTown = data.homeTown;

        if (data.school?.name || data.school?.address) {
            update.school = {};
            if (data.school.name) update.school.name = data.school.name;
            if (data.school.address) update.school.address = data.school.address;
        }

        if (data.college?.name || data.college?.address || (data.college?.course?.length)) {
            update.college = {};
            if (data.college.name) update.college.name = data.college.name;
            if (data.college.address) update.college.address = data.college.address;
            if (data.college.course?.length) update.college.course = data.college.course;
        }

        if (data.earlyTags?.length) update.earlyTags = data.earlyTags;
    }

    if (stage === 4) {
        if (data.previousCompany?.length) update.previousCompany = data.previousCompany;
        if (data.professionalTags?.length) update.professionalTags = data.professionalTags;
    }

    if (stage === 6) {
        if (data.summary) update.summary = data.summary;

        if (data.currentCompany?.name || data.currentCompany?.role) {
            update.currentCompany = {};
            if (data.currentCompany.name) update.currentCompany.name = data.currentCompany.name;
            if (data.currentCompany.role) update.currentCompany.role = data.currentCompany.role;
        }

        if (data.frequentCityLived) update.frequentCityLived = data.frequentCityLived;
        if (data.currentTags?.length) update.currentTags = data.currentTags;
        if (data.skillTags?.length) update.skillTags = data.skillTags;
    }
    return update;
}

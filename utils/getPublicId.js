const getPublicId = (url) => url?.split("/")?.pop()?.split(".")?.[0];

export default getPublicId;

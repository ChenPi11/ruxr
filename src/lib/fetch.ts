import { ExtensionCard, FullExtensionInfo } from './extension';

const EXTENSIONS_LIST_URL = '/pool/Release.json'
const EXTENSIONS_INFO_URL = '/pool/{id}/rubisco.json'

export async function fetchExtensions(): Promise<ExtensionCard[]> {
    const response = await fetch(EXTENSIONS_LIST_URL);
    const responseData = await response.json();
    const data = responseData["pool"];
    const res: ExtensionCard[] = [];
    for (const item of new Map(Object.entries(data))) {
        const extinfo: any = item[1];
        extinfo.id = item[0];
        const extension = ExtensionCard.fromJSON(extinfo);
        res.push(extension);
    }
    return res;
}

export async function fetchExtensionInfo(id: string): Promise<FullExtensionInfo> {
    const response = await fetch(EXTENSIONS_INFO_URL.replace("{id}", id));
    const responseData = await response.json();
    responseData.id = id;
    const extinfo = FullExtensionInfo.fromJSON(responseData);
    extinfo.id = id;
    console.log(extinfo)
    return extinfo;
}

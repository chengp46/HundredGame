export function openWallet(uri: string) {
    const encoded = encodeURIComponent(uri);
    const metamask = `https://metamask.app.link/wc?uri=${encoded}`;
    const trust = `https://link.trustwallet.com/wc?uri=${encoded}`;

    if (/iPhone|iPad/i.test(navigator.userAgent))
        location.href = metamask;
    else
        location.href = trust;
}
import { decode } from '@auth/core/jwt';

// This is decoded example from default jwt of next-auth
const decoded = {
  name: 'Furkan Alan',
  email: 'furkanalan@hotmail.com',
  picture: 'https://avatars.githubusercontent.com/u/24752545?v=4',
  sub: 'clvh4h2p80000je1fqlvoztam',
  iat: 1714241771,
  exp: 1716833771,
  jti: '44f6d7c0-ab14-4904-a909-6fd6a321bac9',
};

async function manualDecode() {
  const privateKey = process.env.NEXT_PUBLIC_APP_TITLE || '';
  console.log('privateKey: ', privateKey);
  const sessionToken =
    'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiSzBuRWFHZHk4OHFpelZoclIxa0dNU0M1RkhDXzBUYnlacVQ0SWtPWGFEcWh0RV9NNk9aR1VWYWg0RnRMUHBfNUdheUZHNDNXbDFZaWtaU25qbUoxQ1EifQ..xQ17gZmFw1-4k_4k_tJ6uQ.icOfPEp8i6dALOTobt7bCnapbdhB31t3ypCK_pIy3RAdnn07td4uWs07XGyYMswnLr1TfRLm4kDlhWtTNzYvQ6Fwkc7d6rFX8VoOmyr08-d6J7Do-ww6UHzDRVPOD60HT7rwxdfFrjHJhEnnSTntrZu7Om6Z6lD9H6hRor3SGy_AlgrfV7Op2VeTiHK_P0KJOgNt3REMJWbnCnXUsgEmjQAVSXImogIzNSSI7dxBGw1IYSOJzyIXUKYs1kbKYhw-pMP5E742Vw_gkXoFLs-aFAPL6EDOmeIUdXF9MYzY2ynN00BqJCnT-Fmtxh8WvO7Y.hFWvv8JrOPlKkiSWrW3Gi2flS4JdxZvVqV8UvR-Pyw4';

  const decoded = await decode({
    token: sessionToken,
    secret: privateKey,
    salt: 'authjs.session-token',
  });

  console.log('decoded: ', decoded);
}

// Self-invocation async function
(async () => {
  await manualDecode();
})().catch((err) => {
  console.error(err);
  throw err;
});

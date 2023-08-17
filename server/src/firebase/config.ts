import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2pfitBrkUlmIC\naC6PaHIU3j5qdw6P+oNE3xx6I/5NiuRjyQKt5lyfjrZh0beFIutBF4SM5vvchrbn\n4PMlcZYNyhA40dShPHNgrP+rfs1U3/lPSP1V60SiMxsrikC4Yn3RJdz1WVOLSpB2\nNJRP9rQOaoCRGnyZJzDr9IVoxvbt1Bc5p49f0CawrGiVHbg7L+R93WVJUJnCwdcL\nhF4yPT649AlyUmbHohGPWXoRkCDyCBKgrXAaT0XwjHp5rqiIozqCauOobnIrz+z0\nBURczvWrCe6vjuitWfBjBZFyHSLaqZWgHbrgCVH7Ul1lZlJuZ5BUv1hEtzEUNi3j\nE74VOelVAgMBAAECggEAAdEIXLgtzEDR1evkiQ3LeXeoYtviRWS2PE+3wDAH2tks\n++0UEL5Mx4cRobFs3aJP33eoNgdW4Lkz30rppo98Cl3eTjv2agNO5nQ+0R0575Ep\n5DPGotcfLKAzfsbDBzjVJYJdGARjN1LVH8fWfceA81YnbZbRpgUX9t2ZghKqHAo1\nA0UTJI39+0DfWmNA/IDYzRZPUGoMNwvGHERrs21zVhv9UJYFKhA8r/DQaI6CgUjg\nhM0soFVmvIEmDiTCJgvGHd/LglTk74rdoU9eyMggm0Qh4EY8DvDXVHs/DMyDC4sr\naTf9Q/dG9XiyCg7syDkjCaNnxgbvBT5Iig5P2rY5NQKBgQD7bhIAww2OSz7gEyzz\nlMsGKyz009Jgf7BksVWLtMCNksMGZPsNs/N1U2d/LjjUCW4f31bNsN/LiZnFJjma\nL1i5WYGFhYPlfY8dvq0GEbUjGC9t2IJOz+b1YDzHrcYzX4jX8+lGdd52oeEpPWbF\nnMxyZEsQigr9syfhYyeHB5kbFwKBgQC599pdCN9y6L7AzjYjtuB3wqkOEEFBjTmu\nqfCfLU4L5GTs1ONYutbtOs5CTZM2DV7gQ8a3f/gNVLDRubno4L6eXLY8s8Oj1skH\nYeIkoDUBjNQ96U7s00binJkOPw1k0L5VXFFUJcV54wsfH18hsdMFmRZ8HEUzY18i\np86OyUHycwKBgQDOHhgII98TDcCHtXCeZxZhAjgipRvMHCGhCneUxiMsbGoQ7euZ\n+jHVtwAblOrleK2c11yz1xJAK5extXp3WeUkXan+qcvM8LfIrK3vUcjq8kK/jESX\nE3zFH5X0JBNdvi3Sy5QrPSmYm3CYfEuqKLa5+FpJPsFv5dUFwmF/Is1zFQKBgHzi\nyH7P1ZcKXAeIs+zaA/YJAJSUL+6Ak6sLLq8GsrHjyC8PbDmLB4i6hAccp26WHg/H\nFCzowEDbjf7ZldKhEwGwSyWKpyhgthHCFyb3e4E1/NYy1rDN1X2bImHhz/HTCO60\nF13GG86VvUNCQxWSoJ7SxrnEFmjDJAFW5a0X1LSnAoGACx8GrEag/LXjncy2YuF9\nsgSxDBGeLl/pzTlw/EEDYoWw6SucfaBiGRUgisfR7GHO3iiGUlcsiWJlmbW42KYq\nv0fN1ctDX8tigKlGp20VlEyG8sJJ32Z9qi7OnJ4rirr8X0X0MQkUzbwYWLwLwunV\nitYZP240eSzN77HgSLlL5x4=\n-----END PRIVATE KEY-----\n",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

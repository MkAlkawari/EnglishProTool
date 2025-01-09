//const userID = event.requestContext.authorizer!.jwt.claims.sub;
import { S3 } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Bucket } from 'sst/node/bucket';
import { DynamoDBClient, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { Table } from 'sst/node/table';
import * as AWS from 'aws-sdk';
const s3 = new S3();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    let questionID = "";
    let questionID2 = "";
    const userID = event.requestContext.authorizer!.jwt.claims.sub; // Target user ID
    const bucketName = "mohdj-codecatalyst-sst-ap-extractedtxtbucket87b8ca-ijzohbu9cf75"; // Name of the S3 bucket
    const pdfBucket = Bucket.BucketTextract.bucketName;
     const dynamodb = new AWS.DynamoDB();
          const tableName = Table.Records.tableName;
          if (!event.body) {
              return { statusCode: 400, body: JSON.stringify({ message: "No body provided in the event" }) };
          }
          let p1Question;
          let p2Question;
          console.log("events:" , event.body);
          const parsedBody = JSON.parse(JSON.parse(event.body))
          console.log("ONE PARSE:", parsedBody)
          p1Question = parsedBody.validSections[0]
          console.log("Questions?:", p1Question)
          console.log("Can we get the choices?:", parsedBody.validSections[0].choices )
    
          
          for (const fullQuestion of parsedBody.validSections) {
            const { question, choices, selectedAnswer } = fullQuestion;
            console.log('Question:', question)
            console.log('Selected Answer:', selectedAnswer)
          }
          const transactItems: any[] = [];
          let id = uuidv4();
          let checker = true;
          while(checker) {
            const check = await dynamodb
            .query({
              TableName: tableName,
              KeyConditionExpression: 'PK = :pk AND SK = :sk',
              ExpressionAttributeValues: {
                ':pk': { S: 'listening' },  // String value for PK
                ':sk': { S: id },   // String value for SK
                },
                ProjectionExpression: 'PK, SK',
            })
            .promise(); 
            const checkQuestion = check.Items?.[0];
            if (checkQuestion) {
              // const sortKey = checkQuestion.SK?.S
              id = uuidv4();
            }
            else {
              checker = false;
            }
           }
           id = "worked"
           transactItems.push({
            Put: {
              TableName: tableName,
              Item: {
                PK: { S: "listening" },
                SK: { S: id },
                P1: {
                  M: {
                    NumOfQuestions: { N: "1" },
                    Questions: {
                      L: [
                        {
                          M: {
                            NumOfSubQuestions: { N: "3" },
                            Question: { S: "Listen and answer the questions." },
                            QuestionType: { S: "Short answers" },
                            SubQuestion: {
                              L: [
                                {
                                  M: {
                                    CorrectAnswers: { 
                                      L: [ 
                                        { 
                                          L: [ 
                                            { S: `${parsedBody.validSections[0].selectedAnswer}` } 
                                          ] 
                                        } 
                                      ] 
                                    },
                                    QuestionText: { S: `${parsedBody.validSections[0].question}` },
                                    QuestionWeight: { N: "1" },
                                  },
                                },
                                {
                                  M: {
                                    CorrectAnswers: { 
                                      L: [ 
                                        { 
                                          L: [ 
                                            { S: `${parsedBody.validSections[1].selectedAnswer}` } 
                                          ] 
                                        } 
                                      ] 
                                    },
                                    QuestionText: { S: `${parsedBody.validSections[1].question}` },
                                    QuestionWeight: { N: "1" },
                                  },
                                },
                                {
                                  M: {
                                    CorrectAnswers: { 
                                      L: [ 
                                        { 
                                          L: [ 
                                            { S: `${parsedBody.validSections[2].selectedAnswer}` } 
                                          ] 
                                        } 
                                      ] 
                                    },
                                    QuestionText: { S: `${parsedBody.validSections[2].question}` },
                                    QuestionWeight: { N: "1" },
                                  },
                                },
                              ],
                            },
                          },
                        },
                      ],
                    },
                    ScriptKey: { S: `${parsedBody.audioUrls[0]}` },
                  },
                },
                P2: {
                  M: {
                    NumOfQuestions: { N: "1" },
                    Questions: {
                      L: [
                        {
                          M: {
                            NumOfSubQuestions: { N: "3" },
                            Question: { S: "Listen and answer the questions." },
                            QuestionType: { S: "Multiple Choice Questions" },
                            SubQuestion: {
                              L: [
                                {
                                  M: {
                                    Choices: {
                                      L: parsedBody.validSections[3].choices.map((choice: string) => ({ S: choice })),
                                    },
                                    CorrectAnswers: { 
                                      L: [ 
                                        { 
                                          L: [ 
                                            { S: `${parsedBody.validSections[3].selectedAnswer}` } 
                                          ] 
                                        } 
                                      ] 
                                    },
                                    QuestionText: { S: `${parsedBody.validSections[3].question}` },
                                    QuestionWeight: { N: "1" },
                                  },
                                },
                                {
                                  M: {
                                    Choices: {
                                      L: parsedBody.validSections[4].choices.map((choice: string) => ({ S: choice })),
                                    },
                                    CorrectAnswers: { 
                                      L: [ 
                                        { 
                                          L: [ 
                                            { S: `${parsedBody.validSections[4].selectedAnswer}` } 
                                          ] 
                                        } 
                                      ] 
                                    },
                                    QuestionText: { S: `${parsedBody.validSections[4].question}` },
                                    QuestionWeight: { N: "1" },
                                  },
                                },
                                {
                                  M: {
                                    Choices: {
                                      L: parsedBody.validSections[5].choices.map((choice: string) => ({ S: choice })),
                                    },
                                    CorrectAnswers: { 
                                      L: [ 
                                        { 
                                          L: [ 
                                            { S: `${parsedBody.validSections[5].selectedAnswer}` } 
                                          ] 
                                        } 
                                      ] 
                                    },
                                    QuestionText: { S: `${parsedBody.validSections[5].question}` },
                                    QuestionWeight: { N: "1" },
                                  },
                                },
                              ],
                            },
                          },
                        },
                      ],
                    },
                    ScriptKey: { S: `${parsedBody.audioUrls[1]}` },
                  },
                },
                P3: {
                  M: {
                    NumOfQuestions: { N: "1" },
                    Questions: {
                      L: [
                        {
                          M: {
                            NumOfSubQuestions: { N: "3" },
                            Question: { S: "Listen and answer the questions." },
                            QuestionType: { S: "Multiple Choice Questions" },
                            SubQuestion: {
                              L: [
                                {
                                  M: {
                                    Choices: {
                                      L: parsedBody.validSections[6].choices.map((choice: string) => ({ S: choice })),
                                    },
                                    CorrectAnswers: { 
                                      L: [ 
                                        { 
                                          L: [ 
                                            { S: `${parsedBody.validSections[6].selectedAnswer}` } 
                                          ] 
                                        } 
                                      ] 
                                    },
                                    QuestionText: { S: `${parsedBody.validSections[6].question}` },
                                  },
                                },
                                {
                                  M: {
                                    Choices: {
                                      L: parsedBody.validSections[7].choices.map((choice: string) => ({ S: choice })),
                                    },
                                    CorrectAnswers: { 
                                      L: [ 
                                        { 
                                          L: [ 
                                            { S: `${parsedBody.validSections[7].selectedAnswer}` } 
                                          ] 
                                        } 
                                      ] 
                                    },
                                    QuestionText: { S: `${parsedBody.validSections[7].question}` },
                                  },
                                },
                                {
                                  M: {
                                    Choices: {
                                      L: parsedBody.validSections[8].choices.map((choice: string) => ({ S: choice })),
                                    },
                                    CorrectAnswers: { 
                                      L: [ 
                                        { 
                                          L: [ 
                                            { S: `${parsedBody.validSections[8].selectedAnswer}` } 
                                          ] 
                                        } 
                                      ] 
                                    },
                                    QuestionText: { S: `${parsedBody.validSections[8].question}` },
                                  },
                                },
                              ],
                            },
                          },
                        },
                      ],
                    },
                    ScriptKey: { S: `${parsedBody.audioUrls[2]}` },
                  },
                },
                P4: {
                  M: {
                    NumOfQuestions: { N: "1" },
                    Questions: {
                      L: [
                        {
                          M: {
                            NumOfSubQuestions: { N: "3" },
                            Question: { S: "Listen and answer the questions." },
                            QuestionType: { S: "Short answers" },
                            SubQuestion: {
                              L: [
                                {
                                  M: {
                                    CorrectAnswers: { 
                                      L: [ 
                                        { 
                                          L: [ 
                                            { S: `${parsedBody.validSections[9].selectedAnswer}` } 
                                          ] 
                                        } 
                                      ] 
                                    },
                                    QuestionText: { S: `${parsedBody.validSections[9].question}` },
                                    QuestionWeight: { N: "1" },
                                  },
                                },
                                {
                                  M: {
                                    CorrectAnswers: { 
                                      L: [ 
                                        { 
                                          L: [ 
                                            { S: `${parsedBody.validSections[10].selectedAnswer}` } 
                                          ] 
                                        } 
                                      ] 
                                    },
                                    QuestionText: { S: `${parsedBody.validSections[10].question}` },
                                    QuestionWeight: { N: "1" },
                                  },
                                },
                                {
                                  M: {
                                    CorrectAnswers: { 
                                      L: [ 
                                        { 
                                          L: [ 
                                            { S: `${parsedBody.validSections[11].selectedAnswer}` } 
                                          ] 
                                        } 
                                      ] 
                                    },
                                    QuestionText: { S: `${parsedBody.validSections[11].question}` },
                                    QuestionWeight: { N: "1" },
                                  },
                                },
                              ],
                            },
                          },
                        },
                      ],
                    },
                    ScriptKey: { S: `${parsedBody.audioUrls[0]}` },
                  },
                },
              },
            },
          });
          
          transactItems.push({
            Update: {
                TableName: tableName,
                Key: { // Key is required for Update
                    PK: { S: "listening" },
                    SK: { S: "index" },
                },
                UpdateExpression: "SET #index = list_append(if_not_exists(#index, :empty_list), :new_element)",
                ExpressionAttributeNames: {
                    "#index": "index"
                },
                ExpressionAttributeValues: {
                    ":new_element": { L: [{ S: id }] },
                    ":empty_list": { L: [] } // Important for creating the list if it doesn't exist
                },
            },
        });
        const transactParams = { TransactItems: transactItems };
        const command = new TransactWriteItemsCommand(transactParams);
        const response = await dynamodb.transactWriteItems(transactParams).promise();
    // List all objects in the S3 bucket
    const objects = await s3.listObjectsV2({ Bucket: bucketName }).promise();
    const objectsPDF = await s3.listObjectsV2({ Bucket: pdfBucket }).promise();


    let targetObjectKey: string | null = null;
    let targetObjectKeyPDF: string | null = null;


    // Find the object whose name contains the userID
    for (const obj of objects.Contents || []) {
      if (obj.Key && obj.Key.includes(userID) && obj.Key.includes("Listening")) {
        targetObjectKey = obj.Key;
        break;
      }
    }
    for (const obj of objectsPDF.Contents || []) {
        if (obj.Key && obj.Key.includes(userID) /*&&  obj.Key.includes("Listening")*/) {
          targetObjectKeyPDF = obj.Key;
          break;
        }
      }

    if (!targetObjectKey || !targetObjectKeyPDF) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: `No object found for userID: ${userID}` }),
      };
    }

    // Retrieve the content of the target object
    const targetObject = await s3
      .deleteObject({ Bucket: bucketName, Key: targetObjectKey })
      .promise();
    const targetObjectpdf = await s3
      .deleteObject({ Bucket: pdfBucket, Key: targetObjectKeyPDF })
      .promise();

    
    

    return {
        statusCode: 200,
        body: JSON.stringify({
          
        }),
      };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error'}),
    };
  }
};
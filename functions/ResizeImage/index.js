const sharp = require('sharp');

module.exports = async function (context, myBlob, outputBlob) {
    context.log('JavaScript blob trigger function processed blob \n Name:', context.bindingData.name, '\n Blob Size:', myBlob.length, 'Bytes');

    try {
        // 이미지 리사이징 설정
        const thumbnailWidth = 200;
        const thumbnailHeight = 200;
        const quality = 80;

        // Sharp를 사용하여 이미지 리사이징
        const resizedImageBuffer = await sharp(myBlob)
            .resize(thumbnailWidth, thumbnailHeight, {
                fit: 'inside', // 비율 유지하면서 크기 조정
                withoutEnlargement: true // 원본보다 크게 만들지 않음
            })
            .jpeg({ quality: quality }) // JPEG 형식으로 변환
            .toBuffer();

        // 리사이징된 이미지를 출력 blob에 저장
        outputBlob = resizedImageBuffer;

        // 성공 로그
        context.log(`Successfully created thumbnail for ${context.bindingData.name}`);
        context.log(`Original size: ${myBlob.length} bytes, Thumbnail size: ${resizedImageBuffer.length} bytes`);

        // 응답 메시지 설정
        context.res = {
            status: 200,
            body: {
                message: "Thumbnail created successfully",
                originalFile: context.bindingData.name,
                thumbnailFile: context.bindingData.name,
                originalSize: myBlob.length,
                thumbnailSize: resizedImageBuffer.length,
                thumbnailUrl: `https://${process.env.STORAGE_ACCOUNT_NAME}.blob.core.windows.net/thumbnails/${context.bindingData.name}`
            }
        };

    } catch (error) {
        // 에러 처리
        context.log.error('Error processing image:', error);
        context.res = {
            status: 500,
            body: {
                message: "Error creating thumbnail",
                error: error.message,
                originalFile: context.bindingData.name
            }
        };
    }
};

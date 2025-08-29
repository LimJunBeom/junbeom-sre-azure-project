module.exports = async function (context, myBlob) {
    context.log(`Blob processed: ${context.bindingData.name}, size: ${myBlob.length} bytes`);

    try {
        const sharp = require('sharp');

        // 이미지 리사이징 (200x200, JPEG, 품질 80%)
        const resized = await sharp(myBlob)
            .resize(200, 200, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: 80 })
            .toBuffer();

        // output binding으로 썸네일 쓰기
        context.bindings.outputBlob = resized;

        // 성공 로그
        context.log(`Successfully created thumbnail for ${context.bindingData.name}`);
        context.log(`Original size: ${myBlob.length} bytes, Thumbnail size: ${resized.length} bytes`);

        // 응답 메시지 설정
        context.res = {
            status: 200,
            body: {
                name: context.bindingData.name,
                container: 'thumbnails',
                originalSize: myBlob.length,
                thumbnailSize: resized.length
            }
        };

    } catch (err) {
        context.log.error('Error processing image:', err);
        context.res = {
            status: 500,
            body: {
                error: err.message,
                originalFile: context.bindingData.name
            }
        };
    }
};

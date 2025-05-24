


const sendSchamaData = async (data) =>
{
    try
    {
        const response = await fetch(`${import.meta.env.VITE_BEAPI}/api/handleSelectedSchema`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                data: data,
            }),
        });

        if (!response.ok) throw new Error('Submission failed');

        return response.json();
;
    }
    catch (err)
    {
        console.error('Error:', err);
    }
}

export default sendSchamaData;

import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, phone, company, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Моля попълнете всички задължителни полета" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Моля въведете валиден email адрес" }, { status: 400 })
    }

    const resendApiKey = process.env.RESEND_API_KEY
    const companyEmail = process.env.VOXAL_COMPANY_EMAIL || "info@voxal.com"

    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured")
      return NextResponse.json({ error: "Email service is not configured" }, { status: 500 })
    }

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Voxal Contact Form <onboarding@resend.dev>",
        to: companyEmail,
        reply_to: email,
        subject: `Ново запитване от ${name}`,
        html: `
          <h2>Ново запитване от контактната форма</h2>
          <p><strong>Име:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Телефон:</strong> ${phone}</p>` : ""}
          ${company ? `<p><strong>Компания:</strong> ${company}</p>` : ""}
          <p><strong>Съобщение:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json()
      console.error("Resend API error:", errorData)
      return NextResponse.json({ error: "Грешка при изпращане на email" }, { status: 500 })
    }

    return NextResponse.json({ message: "Вашата заявка е изпратена успешно!" }, { status: 200 })
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return NextResponse.json({ error: "Възникна грешка при изпращането на заявката" }, { status: 500 })
  }
}

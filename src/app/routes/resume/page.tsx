export default function ResumePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          个人简历
        </h1>
        <p className="text-lg text-gray-600">
          这里是我的教育背景、工作经历和专业技能
        </p>
      </header>

      {/* 教育背景 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">
          教育背景
        </h2>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                在此填写学校名称
              </h3>
              <p className="text-gray-600">专业名称</p>
            </div>
            <p className="text-gray-500">2020 - 2024</p>
          </div>
          <p className="text-gray-700">
            在这里添加关于你的学习经历、成就和研究方向的描述。
          </p>
        </div>
      </section>

      {/* 工作经历 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">
          工作经历
        </h2>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                在此填写公司名称
              </h3>
              <p className="text-gray-600">职位名称</p>
            </div>
            <p className="text-gray-500">2020 - 至今</p>
          </div>
          <p className="text-gray-700">
            在这里添加关于你的工作职责、项目经验和成就的描述。
          </p>
        </div>
      </section>

      {/* 专业技能 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">
          专业技能
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">编程语言</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>技能1</li>
              <li>技能2</li>
              <li>技能3</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">工具与框架</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>工具1</li>
              <li>工具2</li>
              <li>工具3</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 其他信息 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">
          其他信息
        </h2>
        <div className="prose prose-gray max-w-none">
          <p>
            在这里添加其他你想展示的信息，比如获奖经历、证书、语言能力等。
          </p>
        </div>
      </section>
    </div>
  );
} 
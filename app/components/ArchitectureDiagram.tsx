import { ArrowRight, CreditCard, Mail, Wallet, Database, Coins, Package } from 'lucide-react';

export function ArchitectureDiagram() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl text-gray-900 mb-6 text-center">How It Works: Normie to Web3</h3>

      <div className="space-y-8">
        {/* User Types */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Non-Web3 User */}
          <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
            <h4 className="text-lg text-purple-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Non-Web3 User (95% of people)
            </h4>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 text-sm">
                <div className="text-gray-900 mb-1">1. Sign in with email/Google</div>
                <div className="text-xs text-gray-600">No wallet needed</div>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-400 mx-auto" />
              <div className="bg-white rounded-lg p-3 text-sm">
                <div className="text-gray-900 mb-1">2. Pay with credit card</div>
                <div className="text-xs text-gray-600">Familiar checkout flow</div>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-400 mx-auto" />
              <div className="bg-white rounded-lg p-3 text-sm">
                <div className="text-gray-900 mb-1">3. Done! ✅</div>
                <div className="text-xs text-gray-600">NFT appears in account</div>
              </div>
            </div>
          </div>

          {/* Web3 User */}
          <div className="border-2 border-rose-200 rounded-xl p-6 bg-rose-50">
            <h4 className="text-lg text-rose-900 mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Web3 User (5% of people)
            </h4>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 text-sm">
                <div className="text-gray-900 mb-1">1. Connect SUI Wallet</div>
                <div className="text-xs text-gray-600">Suiet, Ethos, etc.</div>
              </div>
              <ArrowRight className="w-5 h-5 text-rose-400 mx-auto" />
              <div className="bg-white rounded-lg p-3 text-sm">
                <div className="text-gray-900 mb-1">2. Pay with crypto/card</div>
                <div className="text-xs text-gray-600">Can use SUI tokens</div>
              </div>
              <ArrowRight className="w-5 h-5 text-rose-400 mx-auto" />
              <div className="bg-white rounded-lg p-3 text-sm">
                <div className="text-gray-900 mb-1">3. NFT goes to their wallet</div>
                <div className="text-xs text-gray-600">Full custody control</div>
              </div>
            </div>
          </div>
        </div>

        {/* Backend Flow */}
        <div className="border-t-2 border-gray-200 pt-8">
          <h4 className="text-lg text-gray-900 mb-4 text-center">Backend Magic (Hidden from Users)</h4>
          
          <div className="relative">
            {/* Flow Steps */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <CreditCard className="w-10 h-10 text-green-600" />
                </div>
                <div className="text-sm text-gray-900 text-center">Payment<br/>Received</div>
              </div>

              <ArrowRight className="w-8 h-8 text-gray-300" />

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <Database className="w-10 h-10 text-purple-600" />
                </div>
                <div className="text-sm text-gray-900 text-center">Create/Find<br/>Wallet</div>
              </div>

              <ArrowRight className="w-8 h-8 text-gray-300" />

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-2">
                  <Package className="w-10 h-10 text-rose-600" />
                </div>
                <div className="text-sm text-gray-900 text-center">Mint NFT<br/>(We Pay Gas)</div>
              </div>

              <ArrowRight className="w-8 h-8 text-gray-300" />

              {/* Step 4 */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                  <Coins className="w-10 h-10 text-amber-600" />
                </div>
                <div className="text-sm text-gray-900 text-center">Award Cork<br/>Tokens</div>
              </div>
            </div>

            {/* Backend Note */}
            <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-700 text-center">
                <strong>Key:</strong> Your backend server has a "sponsor wallet" that pays all gas fees. 
                Users' embedded wallets receive NFTs & tokens without needing crypto knowledge.
              </p>
            </div>
          </div>
        </div>

        {/* Progressive Disclosure */}
        <div className="border-t-2 border-gray-200 pt-8">
          <h4 className="text-lg text-gray-900 mb-4 text-center">Progressive Web3 Education</h4>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="text-2xl mb-2">Day 1</div>
              <div className="text-sm text-gray-700">
                "Your bottle is verified on the blockchain"
                <br/><br/>
                <span className="text-xs text-gray-600">Simple message, no jargon</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
              <div className="text-2xl mb-2">Week 1</div>
              <div className="text-sm text-gray-700">
                "You own 3 NFTs! Want to learn more?"
                <br/><br/>
                <span className="text-xs text-gray-600">Introduce concepts gradually</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-rose-50 rounded-xl p-4 border border-purple-200">
              <div className="text-2xl mb-2">Month 1</div>
              <div className="text-sm text-gray-700">
                "Export your wallet to use anywhere"
                <br/><br/>
                <span className="text-xs text-gray-600">Power user features</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-purple-600 to-rose-600 rounded-xl p-6 text-white text-center">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-3xl mb-1">~$0.0001</div>
              <div className="text-sm text-white/80">Gas cost per NFT</div>
            </div>
            <div>
              <div className="text-3xl mb-1">60%</div>
              <div className="text-sm text-white/80">Conversion rate</div>
            </div>
            <div>
              <div className="text-3xl mb-1">0</div>
              <div className="text-sm text-white/80">Crypto knowledge needed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
